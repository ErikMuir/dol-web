import { NextRequest, NextResponse } from "next/server";
import { EnvKeys, getRequired } from "@erikmuir/dol-lib/env";
import {
  unlockPerformance,
  unlockSerial,
} from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/mint/[accountId]/[showDate]/[position]/[serial]/abort

export type AbortTransferParams = {
  accountId: string;
  showDate: string;
  position: string;
  serial: string;
};

export async function POST(
  _: NextRequest,
  { params }: { params: Promise<AbortTransferParams> }
): Promise<NextResponse<StandardPayload<void | string>>> {
  try {
    const { accountId, showDate, position, serial } = await params;
    const hfbCollectionId = getRequired(EnvKeys.NEXT_PUBLIC_HFB_COLLECTION_ID);
    const parsedPosition = parseInt(position, 10);
    const parsedSerial = parseInt(serial, 10);
    await unlockPerformance(showDate, parsedPosition, accountId);
    await unlockSerial(hfbCollectionId, parsedSerial, accountId);
  } catch (e) {
    console.error(e);
  }
  return success(void 0);
}
