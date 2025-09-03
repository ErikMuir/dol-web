import { GET } from "../route";
import * as Dynamo from "@erikmuir/dol-lib/server/dynamo";
import { suppressConsoleErrors } from "@/test-utils/console";

jest.mock("@erikmuir/dol-lib/server/dynamo", () => ({
  queryResources: jest.fn(),
}));

describe("/api/shows GET", () => {
  suppressConsoleErrors();
  it("returns filtered shows with ok status", async () => {
    (Dynamo.queryResources as jest.Mock).mockResolvedValue([
      { artistId: 1 },
      { artistId: 2 },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data).toHaveLength(1);
  });

  it("handles exceptions and still returns ok with empty array", async () => {
    (Dynamo.queryResources as jest.Mock).mockRejectedValue(new Error("boom"));
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data).toEqual([]);
  });
});


