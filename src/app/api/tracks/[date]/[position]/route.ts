import { NextRequest, NextResponse } from "next/server";
import { Track } from "@erikmuir/dol-lib/types";
import { getShowByDate } from "@erikmuir/dol-lib/server/api";
import { StandardPayload, success } from "@/utils";

// /api/tracks/[date]/[position]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ date: string; position: string }> }
): Promise<NextResponse<StandardPayload<Track | string | undefined>>> {
  let track: Track | undefined;
  try {
    const { date, position } = await params;
    const parsedPosition = parseInt(`${position}`, 10);
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
    if (!position || isNaN(parsedPosition)) {
      throw new Error(`Invalid position: ${position}`);
    }
    const show = await getShowByDate(date);
    if (show && show.tracks && show.tracks.length > 0) {
      const soundchecks = show.tracks.filter((t) => t.setName === "Soundcheck").length;
      const adjustedPosition = parsedPosition - soundchecks;
      track = show.tracks.find((t) => t.position === adjustedPosition);
    }
  } catch (e: any) {
    console.error(e);
  }
  return success(track);
}
