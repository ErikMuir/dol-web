import { GET } from "../route";
import * as Api from "@erikmuir/dol-lib/server/api";
import { suppressConsoleErrors } from "@/test-utils/console";

jest.mock("@erikmuir/dol-lib/server/api", () => ({
  getSetlistsByShowDate: jest.fn(),
}));

const makeParams = (dateOrSlug: string, position: string) => ({ params: Promise.resolve({ dateOrSlug, position }) });

describe("/api/setlists/[date]/[position] GET", () => {
  suppressConsoleErrors();
  it("rejects invalid date and returns undefined", async () => {
    const res = await GET({} as any, makeParams("bad-date", "1") as any);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toBeUndefined();
  });

  it("returns matching setlist for date and position", async () => {
    (Api.getSetlistsByShowDate as jest.Mock).mockResolvedValue([
      { showDate: "1994-07-08", position: 1, artistId: 1 },
      { showDate: "1994-07-08", position: 2, artistId: 1 },
    ]);
    const res = await GET({} as any, makeParams("1994-07-08", "2") as any);
    const body = await res.json();
    expect(body.data).toEqual({ showDate: "1994-07-08", position: 2, artistId: 1 });
  });
});


