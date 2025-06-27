import { NextRequest, NextResponse } from "next/server";
import { Setlist } from "@erikmuir/dol-lib/types";
import { getSetlistsByShowDate } from "@erikmuir/dol-lib/server/api";
import { StandardPayload, success } from "@/utils";

// /api/setlists/[date]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ date: string }> }
): Promise<NextResponse<StandardPayload<Setlist[] | string>>> {
  const artistId = 1; // only phish, for now
  const setlists: Setlist[] = [];
  try {
    const date = (await params).date;
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
    const allSetlists = (await getSetlistsByShowDate(date)) || [];
    const filteredSetlists = allSetlists.filter((setlist) =>
      artistId ? setlist.artistId === artistId : true
    );
    setlists.push(...filteredSetlists);
  } catch (e: any) {
    console.error(e);
  }
  return success(setlists);
}
