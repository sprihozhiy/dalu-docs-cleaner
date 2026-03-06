import { NextRequest, NextResponse } from "next/server";
import { createJob } from "@/lib/jobs";

type ScrapeRequestBody = {
  url?: string;
  depth?: number;
};

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: ScrapeRequestBody;

  try {
    body = (await request.json()) as ScrapeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = body.url?.trim();
  const depth = body.depth ?? 2;

  if (!url || !isValidHttpUrl(url)) {
    return NextResponse.json({ error: "A valid http/https URL is required" }, { status: 400 });
  }

  if (!Number.isInteger(depth) || depth < 0 || depth > 5) {
    return NextResponse.json({ error: "Depth must be a non-negative integer no greater than 5" }, { status: 400 });
  }

  const job = createJob(url, depth);

  return NextResponse.json({ jobId: job.id }, { status: 202 });
}
