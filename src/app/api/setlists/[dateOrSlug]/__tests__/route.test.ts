import { GET } from "../route";
import * as Api from "@erikmuir/dol-lib/server/api";
import { suppressConsoleErrors } from "@/test-utils/console";

jest.mock("@erikmuir/dol-lib/server/api", () => ({
  getSetlistsByShowDate: jest.fn(),
  getSetlistsBySong: jest.fn(),
}));

const makeParams = (dateOrSlug: string) => ({ params: Promise.resolve({ dateOrSlug }) });

describe("/api/setlists/[dateOrSlug] GET", () => {
  suppressConsoleErrors();
  it("throws on missing param and returns empty array", async () => {
    const res = await GET({} as any, { params: Promise.resolve({}) } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toEqual([]);
  });

  it("rejects short param and returns empty array", async () => {
    const res = await GET({} as any, makeParams("ab") as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual([]);
  });

  it("chooses getSetlistsByShowDate for valid date", async () => {
    (Api.getSetlistsByShowDate as jest.Mock).mockResolvedValue([{ artistId: 1 }, { artistId: 2 }]);
    const res = await GET({} as any, makeParams("1994-07-08") as any);
    const body = await res.json();
    expect(Api.getSetlistsByShowDate).toHaveBeenCalled();
    expect(Api.getSetlistsBySong).not.toHaveBeenCalled();
    // filters artistId === 1
    expect(body.data).toEqual([{ artistId: 1 }]);
  });

  it("chooses getSetlistsBySong for non-date slug", async () => {
    (Api.getSetlistsBySong as jest.Mock).mockResolvedValue([{ artistId: 1 }, { artistId: 3 }]);
    const res = await GET({} as any, makeParams("harpua") as any);
    const body = await res.json();
    expect(Api.getSetlistsBySong).toHaveBeenCalled();
    expect(body.data).toEqual([{ artistId: 1 }]);
  });
});


