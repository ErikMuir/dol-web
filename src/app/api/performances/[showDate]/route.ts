import { NextRequest, NextResponse } from "next/server";
import { DolPerformance } from "@erikmuir/dol-lib/types";
import { queryPerformances } from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/performances/[showDate]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ showDate: string }> }
): Promise<NextResponse<StandardPayload<DolPerformance[] | string>>> {
  try {
    const { showDate } = await params;
    const performances = await queryPerformances(showDate);
    return success(performances);
  } catch (e) {
    console.error(e);
    return success([]);
  }
}
