import { GET } from "../route";
import * as Dynamo from "@erikmuir/dol-lib/server/dynamo";
import { suppressConsoleErrors } from "@/test-utils/console";
import { NextRequest } from "next/server";

jest.mock("@erikmuir/dol-lib/server/dynamo", () => ({
  getResource: jest.fn(),
}));

const makeParams = (songId: string) => ({ params: Promise.resolve({ songId }) });

describe("/api/songs/[songId] GET", () => {
  suppressConsoleErrors();
  it("returns undefined when songId missing", async () => {
    const res = await GET({} as NextRequest, makeParams(undefined as unknown as string));
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toBeUndefined();
  });

  it("fetches and returns song by id", async () => {
    (Dynamo.getResource as jest.Mock).mockResolvedValue({ id: "123", title: "Song" });
    const res = await GET({} as NextRequest, makeParams("123"));
    const body = await res.json();
    expect(Dynamo.getResource).toHaveBeenCalledWith("songs", "123");
    expect(body.data).toEqual({ id: "123", title: "Song" });
  });
});


