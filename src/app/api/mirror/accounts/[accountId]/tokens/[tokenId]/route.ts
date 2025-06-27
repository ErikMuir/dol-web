import { NextRequest, NextResponse } from "next/server";
import { getMirrorClient } from "@erikmuir/dol-lib/server/api";
import { success, StandardPayload } from "@/utils";

// /api/mirror/accounts/[accountId]/tokens/[tokenId]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ accountId: string; tokenId: string }> }
): Promise<NextResponse<StandardPayload<boolean>>> {
  const accountId = (await params).accountId;
  const tokenId = (await params).tokenId;
  const isAssociated = await getMirrorClient().isTokenAssociated(
    accountId,
    tokenId
  );
  return success(isAssociated);
}
