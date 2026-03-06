import { NextRequest, NextResponse } from "next/server";
import { cancelJob, getJob } from "@/lib/jobs";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function GET(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { jobId } = await context.params;
  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function DELETE(_: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { jobId } = await context.params;
  const job = cancelJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
