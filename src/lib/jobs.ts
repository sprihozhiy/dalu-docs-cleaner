import { randomUUID } from "node:crypto";
import { crawlDocumentation, type ScrapedPage } from "@/lib/scraper";

export type JobStatus = "pending" | "running" | "done" | "failed";

type JobResult = {
  pages: ScrapedPage[];
  startedAt: string;
  finishedAt: string;
  depth: number;
};

type ScrapeJob = {
  id: string;
  url: string;
  depth: number;
  status: JobStatus;
  progress: number;
  result?: JobResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  finishedAt?: string;
  abortController?: AbortController;
};

export type PublicJob = {
  id: string;
  status: JobStatus;
  progress: number;
  result?: JobResult;
};

const jobs = new Map<string, ScrapeJob>();

function nowIso(): string {
  return new Date().toISOString();
}

function toPublicJob(job: ScrapeJob): PublicJob {
  return {
    id: job.id,
    status: job.status,
    progress: Math.max(0, Math.min(100, Math.round(job.progress))),
    result: job.result,
  };
}

async function runJob(jobId: string): Promise<void> {
  const job = jobs.get(jobId);
  // A pending job may have been canceled before the microtask ran.
  if (!job || job.status === "failed") {
    return;
  }

  job.status = "running";
  job.startedAt = nowIso();
  job.updatedAt = nowIso();
  job.abortController = new AbortController();

  try {
    const pages = await crawlDocumentation(job.url, job.depth, {
      signal: job.abortController.signal,
      onProgress: (progress) => {
        const current = jobs.get(jobId);
        if (!current || current.status === "failed") {
          return;
        }

        current.progress = progress;
        current.updatedAt = nowIso();
      },
    });

    const current = jobs.get(jobId);
    if (!current || current.status === "failed") {
      return;
    }

    current.status = "done";
    current.progress = 100;
    current.finishedAt = nowIso();
    current.updatedAt = nowIso();
    current.result = {
      pages,
      startedAt: current.startedAt ?? current.createdAt,
      finishedAt: current.finishedAt,
      depth: current.depth,
    };
    delete current.abortController;
  } catch (error) {
    const current = jobs.get(jobId);
    if (!current) {
      return;
    }

    current.status = "failed";
    current.finishedAt = nowIso();
    current.updatedAt = nowIso();
    current.error = error instanceof Error ? error.message : "Unknown scrape failure";
    delete current.abortController;
  }
}

export function createJob(url: string, depth = 2): PublicJob {
  const id = randomUUID();
  const createdAt = nowIso();

  const job: ScrapeJob = {
    id,
    url,
    depth,
    status: "pending",
    progress: 0,
    createdAt,
    updatedAt: createdAt,
  };

  jobs.set(id, job);

  queueMicrotask(() => {
    void runJob(id);
  });

  return toPublicJob(job);
}

export function getJob(jobId: string): PublicJob | null {
  const job = jobs.get(jobId);
  return job ? toPublicJob(job) : null;
}

// REVIEW: Jobs are never evicted from the in-memory map. On a long-running
// server this leaks memory proportional to the number of jobs created (each
// job result can hold many scraped pages). Consider a TTL-based cleanup or a
// max-jobs LRU cap.
export function getJobs(): PublicJob[] {
  return Array.from(jobs.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublicJob);
}

export function cancelJob(jobId: string): PublicJob | null {
  const job = jobs.get(jobId);
  if (!job) {
    return null;
  }

  if (job.status === "pending" || job.status === "running") {
    job.abortController?.abort();
    job.status = "failed";
    job.error = "Job canceled";
    job.finishedAt = nowIso();
    job.updatedAt = nowIso();
    delete job.abortController;
  }

  return toPublicJob(job);
}
