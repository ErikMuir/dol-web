import { NextRequest, NextResponse } from "next/server";
import { AuditLogData } from "@erikmuir/dol-lib/types";
import { queryAuditLogs } from "@erikmuir/dol-lib/server/dynamo";
import { StandardPayload, success } from "@/utils";

// /api/audit-logs/[key]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ key: string }> }
): Promise<NextResponse<StandardPayload<AuditLogData[] | string>>> {
  try {
    const { key } = await params;
    const auditLogs = await queryAuditLogs(key);
    return success(auditLogs.map((log) => log.data));
  } catch (e: any) {
    console.error(e);
    return success([]);
  }
}
