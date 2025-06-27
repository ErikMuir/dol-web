import { NextRequest, NextResponse } from "next/server";
import { Song } from "@erikmuir/dol-lib/types";
import { getResource } from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/songs/[songId]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ songId: string }> }
): Promise<NextResponse<StandardPayload<Song | string | undefined>>> {
  let song: Song | undefined;
  try {
    const songId = (await params).songId;
    if (!songId) {
      throw new Error(`Missing songId.`);
    }
    song = await getResource<Song>("songs", songId);
  } catch (e: any) {
    console.error(e);
  }
  return success(song);
}
