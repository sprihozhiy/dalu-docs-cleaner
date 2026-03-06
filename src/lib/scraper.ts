import * as cheerio from "cheerio";
import fetch from "node-fetch";
import TurndownService from "turndown";

type ProgressCallback = (progress: number) => void;

export type ScrapedPage = {
  url: string;
  markdown: string;
};

type CrawlOptions = {
  signal?: AbortSignal;
  onProgress?: ProgressCallback;
};

type QueueItem = {
  url: string;
  level: number;
};

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new Error("Scrape aborted");
  }
}

function sanitizeContent(html: string): string {
  const $ = cheerio.load(html);

  $("script, style, nav, footer, aside, noscript").remove();
  $('[role="navigation"], [role="complementary"], .sidebar, #sidebar').remove();

  const main = $("main").first();
  if (main.length > 0) {
    return main.html() ?? "";
  }

  const article = $("article").first();
  if (article.length > 0) {
    return article.html() ?? "";
  }

  return $("body").html() ?? html;
}

function extractInternalLinks(html: string, pageUrl: string, rootOrigin: string): string[] {
  const $ = cheerio.load(html);
  const links = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) {
      return;
    }

    try {
      const resolved = new URL(href, pageUrl);
      resolved.hash = "";

      if (resolved.origin === rootOrigin && /^https?:$/.test(resolved.protocol)) {
        links.add(resolved.toString());
      }
    } catch {
      // Ignore malformed URLs.
    }
  });

  return Array.from(links);
}

// REVIEW: No SSRF protection. The caller can supply any URL including private
// network addresses (e.g. http://169.254.169.254, http://10.0.0.1,
// http://localhost). Resolve the hostname to an IP and reject RFC-1918 /
// loopback / link-local ranges before fetching.
export async function crawlDocumentation(
  startUrl: string,
  maxDepth = 2,
  options: CrawlOptions = {}
): Promise<ScrapedPage[]> {
  const rootUrl = new URL(startUrl);
  const rootOrigin = rootUrl.origin;
  const queue: QueueItem[] = [{ url: rootUrl.toString(), level: 0 }];
  const visited = new Set<string>([rootUrl.toString()]);
  const pages: ScrapedPage[] = [];

  let processedCount = 0;

  while (queue.length > 0) {
    assertNotAborted(options.signal);

    const item = queue.shift();
    if (!item) {
      break;
    }

    // REVIEW: No per-request timeout. A slow or stalled server will hold the
    // job open indefinitely. Consider combining the abort signal with a
    // per-request timeout: AbortSignal.any([signal, AbortSignal.timeout(30_000)]).
    const response = await fetch(item.url, { signal: options.signal });
    if (!response.ok) {
      // Skip non-ok pages rather than aborting the entire crawl — a single
      // 404 on a discovered link should not fail all already-scraped pages.
      processedCount += 1;
      const progress = (processedCount / (processedCount + queue.length)) * 100;
      options.onProgress?.(progress);
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      processedCount += 1;
      const progress = (processedCount / (processedCount + queue.length)) * 100;
      options.onProgress?.(progress);
      continue;
    }

    // REVIEW: No response body size limit. A malicious or misconfigured server
    // can return a gigabyte-sized body and exhaust server memory. Consider
    // enforcing a max body size (e.g. 5 MB) before calling response.text().
    // REVIEW: No cap on total pages crawled. A site with thousands of unique
    // internal links will visit all of them. Consider a MAX_PAGES constant and
    // breaking out of the loop when pages.length reaches it.
    const html = await response.text();
    const cleanHtml = sanitizeContent(html);
    const markdown = turndown.turndown(cleanHtml).trim();

    pages.push({
      url: item.url,
      markdown,
    });

    if (item.level < maxDepth) {
      const internalLinks = extractInternalLinks(html, item.url, rootOrigin);
      for (const link of internalLinks) {
        if (!visited.has(link)) {
          visited.add(link);
          queue.push({ url: link, level: item.level + 1 });
        }
      }
    }

    processedCount += 1;
    const progress = (processedCount / (processedCount + queue.length)) * 100;
    options.onProgress?.(progress);
  }

  return pages;
}
