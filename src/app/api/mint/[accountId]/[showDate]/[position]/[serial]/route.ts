import { NextRequest, NextResponse } from "next/server";
import { getDappConfig, getPerformanceId } from "@erikmuir/dol-lib/common/dapp";
import { updateNftMetadata } from "@erikmuir/dol-lib/server/dapp";
import {
  getPerformance,
  setSerial,
  setPurchaseDetails,
} from "@erikmuir/dol-lib/server/dynamo";
import { isWhiteListed, isMintEnabled } from "@/env";
import { badRequest, StandardPayload, success } from "@/utils";

// /api/mint/[accountId]/[showDate]/[position]/[serial] (post-transfer endpoint)

export type PostTransferParams = {
  accountId: string;
  showDate: string;
  position: string;
  serial: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<PostTransferParams> }
): Promise<NextResponse<StandardPayload<boolean | string>>> {
  const { accountId, showDate, position, serial } = await params;

  if (!isMintEnabled && !isWhiteListed(accountId)) {
    return badRequest("Minting is disabled");
  }

  const { hfbCollectionId } = getDappConfig();
  const parsedPosition = parseInt(position, 10);
  const parsedSerial = parseInt(serial, 10);
  const performanceId = getPerformanceId(showDate, parsedPosition);

  const performance = await getPerformance(showDate, parsedPosition);
  if (
    !performance ||
    performance.lockedSerial !== parsedSerial ||
    performance.lockedBy !== accountId ||
    !performance.attributes
  ) {
    console.log("Performance not found or not locked:", {
      performanceFound: Boolean(performance),
      lockedSerial: performance?.lockedSerial,
      lockedBy: performance?.lockedBy,
      expectedSerial: parsedSerial,
      expectedAccountId: accountId,
    });
    return success(false);
  }

  const setPurchaseDetailsResult = await setPurchaseDetails(
    hfbCollectionId,
    parsedSerial,
    performanceId,
    accountId
  );
  if (!setPurchaseDetailsResult.success) {
    console.error(
      `Failed to update serial: ${setPurchaseDetailsResult.reason}`
    );
    return success(false);
  }

  const updateNftMetadataResult = await updateNftMetadata(
    hfbCollectionId,
    parsedSerial,
    showDate,
    parsedPosition,
    accountId,
    performance.attributes
  );
  if (!updateNftMetadataResult) {
    console.error("Failed to update metadata.");
    return success(false);
  }

  const setSerialResult = await setSerial(
    showDate,
    parsedPosition,
    accountId,
    parsedSerial
  );
  if (!setSerialResult.success) {
    console.error(
      `Failed to set serial on performance: ${setSerialResult.reason}`
    );
    return success(false);
  }

  return success(true);
}
