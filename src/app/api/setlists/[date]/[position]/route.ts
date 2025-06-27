import { NextRequest, NextResponse } from "next/server";
import { Setlist } from "@erikmuir/dol-lib/types";
import { getSetlistsByShowDate } from "@erikmuir/dol-lib/server/api";
import { StandardPayload, success } from "@/utils";

// /api/setlists/[date]/[position]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ date: string; position: string }> }
): Promise<NextResponse<StandardPayload<Setlist | string | undefined>>> {
  const artistId = 1; // only phish, for now
  let setlist: Setlist | undefined;
  try {
    const { date, position } = await params;
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
    const setlists = (await getSetlistsByShowDate(date)) || [];
    setlist = setlists.find(
      (s) =>
        s.showDate === date &&
        `${s.position}` === position &&
        s.artistId === artistId
    );
  } catch (e: any) {
    console.error(e);
  }
  return success(setlist);
}
