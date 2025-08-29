import { NextRequest, NextResponse } from "next/server";
import { Setlist } from "@erikmuir/dol-lib/types";
import { getSetlistsByShowDate, getSetlistsBySong } from "@erikmuir/dol-lib/server/api";
import { StandardPayload, success } from "@/utils";

// /api/setlists/[dateOrSlug]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ dateOrSlug: string }> }
): Promise<NextResponse<StandardPayload<Setlist[] | string>>> {
  const setlists: Setlist[] = [];
  try {
    const dateOrSlug = (await params).dateOrSlug;
    if (!dateOrSlug) throw new Error(`Missing date or slug.`);
    if (dateOrSlug.length < 3) throw new Error(`Invalid date or slug.`);
    const action = isNaN(Date.parse(dateOrSlug)) ? getSetlistsBySong : getSetlistsByShowDate;
    const allSetlists = (await action(dateOrSlug, {}, true)) || [];
    const filteredSetlists = allSetlists.filter((setlist) => setlist.artistId === 1);
    setlists.push(...filteredSetlists);
  } catch (e: any) {
    console.error(e);
  }
  return success(setlists);
}
