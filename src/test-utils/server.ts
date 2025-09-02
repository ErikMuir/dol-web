import { NextResponse } from "next/server";

export type TestRequest = Partial<Request> & { method?: string; url?: string; body?: any };

export function makeNextRequest(init: TestRequest = {}): any {
  // For our handlers we only pass NextRequest in signature but rarely use it.
  // Return a minimal stub.
  return {} as any;
}

export async function parseJson(res: any) {
  const json = await res.json();
  return json;
}


