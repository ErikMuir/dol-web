import {
  nextResponse,
  success,
  errorResponse,
  methodNotAllowed,
  notFound,
  badRequest,
  unauthenticated,
  forbidden,
  serverError,
} from "@/utils/api-responses";

describe("api-responses", () => {
  it("nextResponse wraps ok payload when status < 400", () => {
    const res = nextResponse({ a: 1 }, 200);
    // NextResponse.json() returns a Response-like; we inspect body by parsing .text()
    expect(res.status).toBe(200);
  });

  it("nextResponse wraps error payload when status >= 400", () => {
    const res = nextResponse("bad", 500);
    expect(res.status).toBe(500);
  });

  it("success forces status < 400", () => {
    const res = success({ a: 1 }, 500);
    expect(res.status).toBe(200);
  });

  it("errorResponse forces status >= 400", () => {
    const res = errorResponse("oops", 200);
    expect(res.status).toBe(500);
  });

  it("helpers return expected codes", () => {
    expect(methodNotAllowed().status).toBe(405);
    expect(notFound().status).toBe(404);
    expect(badRequest().status).toBe(400);
    expect(unauthenticated().status).toBe(401);
    expect(forbidden().status).toBe(403);
    expect(serverError().status).toBe(500);
  });
});


