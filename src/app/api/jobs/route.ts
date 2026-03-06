import { NextResponse } from "next/server";
import { getJobs } from "@/lib/jobs";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(getJobs());
}
