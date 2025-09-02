import { GET } from "../route";
import * as Dynamo from "@erikmuir/dol-lib/server/dynamo";
import { suppressConsoleErrors } from "@/test-utils/console";

jest.mock("@erikmuir/dol-lib/server/dynamo", () => ({
  getResource: jest.fn(),
}));

const makeParams = (songId?: string) => ({ params: Promise.resolve(songId ? { songId } : ({} as any)) });

describe("/api/songs/[songId] GET", () => {
  suppressConsoleErrors();
  it("returns undefined when songId missing", async () => {
    const res = await GET({} as any, makeParams(undefined) as any);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toBeUndefined();
  });

  it("fetches and returns song by id", async () => {
    (Dynamo.getResource as jest.Mock).mockResolvedValue({ id: "123", title: "Song" });
    const res = await GET({} as any, makeParams("123") as any);
    const body = await res.json();
    expect(Dynamo.getResource).toHaveBeenCalledWith("songs", "123");
    expect(body.data).toEqual({ id: "123", title: "Song" });
  });
});


