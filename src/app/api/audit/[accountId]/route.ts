import { NextRequest, NextResponse } from "next/server";
import { AuditLogData } from "@erikmuir/dol-lib/types";
import { auditClient } from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/audit/[accountId]

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
): Promise<NextResponse<StandardPayload<boolean>>> {
  const accountId = (await params).accountId;
  const auditLog: AuditLogData = (await req.json()) || {};
  auditLog.accountId = accountId;
  await auditClient(auditLog);
  return success(true);
}
