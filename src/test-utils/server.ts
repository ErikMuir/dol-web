import { NextResponse } from "next/server";

export type TestRequest = Partial<Request> & { method?: string; url?: string; body?: unknown };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function makeNextRequest(_init: TestRequest = {}): NextResponse {
  // For our handlers we only pass NextRequest in signature but rarely use it.
  // Return a minimal stub.
  return {} as NextResponse;
}

export async function parseJson(res: NextResponse) {
  const json = await res.json();
  return json;
}


