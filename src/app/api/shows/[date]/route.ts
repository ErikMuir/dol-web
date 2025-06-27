import { NextRequest, NextResponse } from "next/server";
import { Show } from "@erikmuir/dol-lib/types";
import { getResource } from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/shows/[date]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ date: string }> }
): Promise<NextResponse<StandardPayload<Show | string | undefined>>> {
  let show: Show | undefined;
  try {
    const date = (await params).date;
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
    show = await getResource<Show>("shows", date);
  } catch (e: any) {
    console.error(e);
  }
  return success(show);
}
