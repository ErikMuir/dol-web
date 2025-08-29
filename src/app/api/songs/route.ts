import { NextRequest, NextResponse } from "next/server";
import { Song } from "@erikmuir/dol-lib/types";
import { StandardPayload, success } from "@/utils";
import { getSongs } from "@erikmuir/dol-lib/server/api";
import { distinctProperty } from "@erikmuir/dol-lib/common/utils";

// /api/songs

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{}> }
): Promise<NextResponse<StandardPayload<Song[] | string>>> {
  let songs: Song[] = [];
  try {
    const allSongs = await getSongs();
    if (allSongs && allSongs.length > 0) {
      const distinctSongs = allSongs.filter((s, index, self) =>
        index === self.findIndex((t) => t.songId === s.songId)
      );
      songs.push(...distinctSongs);
    }
  } catch (e: any) {
    console.error(e);
  }
  return success(songs);
}
