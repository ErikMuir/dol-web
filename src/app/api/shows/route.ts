import { NextResponse } from "next/server";
import { Show } from "@erikmuir/dol-lib/types";
import { queryResources } from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/shows

export async function GET(): Promise<NextResponse<StandardPayload<Show[] | string>>> {
  const artistId = 1; // only phish, for now
  const shows: Show[] = [];
  try {
    const allShows = (await queryResources<Show>("shows")) || [];
    const filteredShows = allShows.filter((show) =>
      artistId ? show.artistId === artistId : true
    );
    shows.push(...filteredShows);
  } catch (e) {
    console.error(e);
  }
  return success(shows);
}
