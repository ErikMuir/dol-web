import { NextRequest, NextResponse } from "next/server";
import { Hbar, TransferTransaction } from "@hashgraph/sdk";
import {
  PerformanceAttributes,
  SerialErrorResponse,
} from "@erikmuir/dol-lib/types";
import { getDappConfig } from "@erikmuir/dol-lib/common/dapp";
import { getHederaClient } from "@erikmuir/dol-lib/server/blockchain";
import { obtainLock } from "@erikmuir/dol-lib/server/dapp";
import { badRequest, StandardPayload, success } from "@/utils";

// /api/mint/[accountId]/[showDate]/[position] (pre-transfer endpoint)

export type PreTransferParams = {
  accountId: string;
  showDate: string;
  position: string;
};

export type ServerPreTransferResponse = {
  serial: number | SerialErrorResponse;
  txBytes?: Uint8Array<ArrayBufferLike>;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<PreTransferParams> }
): Promise<NextResponse<StandardPayload<ServerPreTransferResponse | string>>> {
  const { showDate, position, accountId } = await params;

  const attributes: PerformanceAttributes = await req.json();
  if (!attributes) {
    return badRequest("No attributes provided");
  }

  const serial = await obtainLock(
    accountId,
    showDate,
    parseInt(position),
    attributes
  );

  if (serial <= 0) {
    return success({ serial });
  }

  const { hfbCollectionId, hfbHbarPrice, dappAccountId } = getDappConfig();

  const client = getHederaClient();

  const transaction = new TransferTransaction()
    .addHbarTransfer(accountId, new Hbar(-hfbHbarPrice))
    .addHbarTransfer(dappAccountId, new Hbar(hfbHbarPrice))
    .addNftTransfer(hfbCollectionId, serial, dappAccountId, accountId)
    .freezeWith(client);
  const signedTx = await transaction.signWithOperator(client);
  const txBytes = signedTx.toBytes();

  return success({ serial, txBytes });
}
