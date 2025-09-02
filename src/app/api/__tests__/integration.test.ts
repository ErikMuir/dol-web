import request from "supertest";
import { createApp } from "@/test-utils/integration";
import { suppressConsoleErrors } from "@/test-utils/console";

import * as ShowsRoute from "../shows/route";
import * as SetlistsRoute from "../setlists/[dateOrSlug]/route";
import * as SetlistByPosRoute from "../setlists/[dateOrSlug]/[position]/route";
import * as SongRoute from "../songs/[songId]/route";

import * as Dynamo from "@erikmuir/dol-lib/server/dynamo";
import * as Api from "@erikmuir/dol-lib/server/api";

jest.mock("@erikmuir/dol-lib/server/dynamo", () => ({
  queryResources: jest.fn(),
  getResource: jest.fn(),
}));

jest.mock("@erikmuir/dol-lib/server/api", () => ({
  getSetlistsByShowDate: jest.fn(),
  getSetlistsBySong: jest.fn(),
}));

const app = createApp([
  { path: "/api/shows", handler: ShowsRoute.GET },
  { path: "/api/setlists/:dateOrSlug", handler: SetlistsRoute.GET },
  { path: "/api/setlists/:dateOrSlug/:position", handler: SetlistByPosRoute.GET },
  { path: "/api/songs/:songId", handler: SongRoute.GET },
]);

describe("API integration", () => {
  suppressConsoleErrors();

  it("GET /api/shows returns filtered list", async () => {
    (Dynamo.queryResources as jest.Mock).mockResolvedValueOnce([
      { artistId: 1 },
      { artistId: 2 },
    ]);
    const res = await request(app).get("/api/shows");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("GET /api/setlists/:dateOrSlug uses song slug branch", async () => {
    (Api.getSetlistsBySong as jest.Mock).mockResolvedValueOnce([{ artistId: 1 }, { artistId: 3 }]);
    const res = await request(app).get("/api/setlists/harpua");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ artistId: 1 }]);
  });

  it("GET /api/setlists/:dateOrSlug/:position returns specific setlist", async () => {
    (Api.getSetlistsByShowDate as jest.Mock).mockResolvedValueOnce([
      { showDate: "1994-07-08", position: 1, artistId: 1 },
      { showDate: "1994-07-08", position: 2, artistId: 1 },
    ]);
    const res = await request(app).get("/api/setlists/1994-07-08/2");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ showDate: "1994-07-08", position: 2, artistId: 1 });
  });

  it("GET /api/songs/:songId fetches song", async () => {
    (Dynamo.getResource as jest.Mock).mockResolvedValueOnce({ id: "123", title: "Song" });
    const res = await request(app).get("/api/songs/123");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ id: "123", title: "Song" });
  });
});
