import { NextRequest, NextResponse } from "next/server";
import { getPerformance } from "@erikmuir/dol-lib/server/dynamo";
import { DolPerformance } from "@erikmuir/dol-lib/types";
import { errorResponse, notFound, StandardPayload, success } from "@/utils";

// /api/performances/[showDate]/[position]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ showDate: string; position: string }> }
): Promise<NextResponse<StandardPayload<DolPerformance | string>>> {
  try {
    const { showDate, position } = await params;
    const performance = await getPerformance(showDate, parseInt(position));
    return performance ? success(performance) : notFound();
  } catch (e) {
    console.error(e);
    return errorResponse((e as Error).message, 503);
  }
}
