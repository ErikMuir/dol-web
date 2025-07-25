import { NextRequest, NextResponse } from "next/server";
import { Track } from "@erikmuir/dol-lib/types";
import { getShowByDate } from "@erikmuir/dol-lib/server/api";
import { StandardPayload, success } from "@/utils";

// /api/tracks/[date]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ date: string }> }
): Promise<NextResponse<StandardPayload<Track[]>>> {
  const tracks: Track[] = [];
  try {
    const { date } = await params;
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
    const show = await getShowByDate(date);
    if (show && show.tracks && show.tracks.length > 0) {
      const soundchecks = show.tracks.filter(
        (t) => t.setName === "Soundcheck"
      ).length;
      for (const track of show.tracks) {
        const adjustedPosition = track.position - soundchecks;
        tracks.push({
          ...track,
          position: adjustedPosition,
        });
      }
    }
  } catch (e: any) {
    console.error(e);
  }
  return success(tracks);
}
