import { NextRequest, NextResponse } from "next/server";
import { MirrorNft } from "@erikmuir/dol-lib/types";
import { getMirrorClient } from "@erikmuir/dol-lib/server/api";
import { success, StandardPayload } from "@/utils";

// /api/mirror/accounts/[accountId]/nfts/[tokenId]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ accountId: string; tokenId: string }> }
): Promise<NextResponse<StandardPayload<MirrorNft[]>>> {
  const { accountId, tokenId } = await params;
  const nfts = await getMirrorClient().getAccountNfts(accountId, tokenId);
  return success(nfts);
}
