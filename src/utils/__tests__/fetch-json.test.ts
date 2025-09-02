import { fetchJson, fetchStandardJson } from "@/utils";

describe("fetchJson", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("adds x-api-key header and returns json", async () => {
    const mockResponse = { hello: "world" };
    (global.fetch as any) = jest.fn().mockResolvedValue({ json: () => Promise.resolve(mockResponse) });

    const result = await fetchJson<any>("/api/test");

    expect(global.fetch).toHaveBeenCalledWith("/api/test", expect.objectContaining({
      headers: expect.objectContaining({ "x-api-key": `${process.env.NEXT_PUBLIC_API_TOKEN}` })
    }));
    expect(result).toEqual(mockResponse);
  });
});

describe("fetchStandardJson", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns data when ok is true", async () => {
    const payload = { ok: true as const, data: { a: 1 } };
    (global.fetch as any) = jest.fn().mockResolvedValue({ json: () => Promise.resolve(payload) });

    const result = await fetchStandardJson<{ a: number }>("/api/ok");
    expect(result).toEqual({ a: 1 });
  });

  it("throws error when ok is false", async () => {
    const payload = { ok: false as const, error: "Bad" };
    (global.fetch as any) = jest.fn().mockResolvedValue({ json: () => Promise.resolve(payload) });

    await expect(fetchStandardJson("/api/bad")).rejects.toThrow("Bad");
  });
});


