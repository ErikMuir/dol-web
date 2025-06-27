"use client";

import useSWR from "swr";
import { AuditLogData } from "@erikmuir/dol-lib/types";
import { fetchStandardJson } from "@/utils";

export function useAuditLogs(key?: string | null) {
  const url = key ? `/api/audit-logs/${key}` : null;
  const { data, isLoading, error } = useSWR<AuditLogData[]>(url, fetchStandardJson);
  return {
    auditLogs: data,
    auditLogsLoading: isLoading,
    auditLogsError: error,
  };
}

export function useAuditLogsByPerformance(
  showDate?: string,
  position?: number
) {
  const url =
    showDate && position ? `/api/audit-logs/${showDate}:${position}` : null;
  const { data, isLoading, error } = useSWR<AuditLogData[]>(url, fetchStandardJson);
  return {
    auditLogs: data,
    auditLogsLoading: isLoading,
    auditLogsError: error,
  };
}
