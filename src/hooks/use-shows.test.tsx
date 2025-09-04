import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import * as Utils from "@/utils";
import { useShows, useShow, useShowsByDate, useShowsByVenue } from "./use-shows";

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  fetchStandardJson: jest.fn(),
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe("use-shows hooks", () => {
  beforeEach(() => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockReset();
  });

  it("useShows returns data", async () => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockResolvedValueOnce([
      { artistId: 1, showYear: 1994, showMonth: 7, showDay: 8, venue: "A" },
    ]);

    const { result } = renderHook(() => useShows(), { wrapper });
    await waitFor(() => expect(result.current.shows).toBeDefined());
    expect(result.current.showsLoading).toBe(false);
    expect(result.current.showsError).toBeUndefined();
  });

  it("useShow returns single show", async () => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockResolvedValueOnce({
      artistId: 1,
      showYear: 1994,
      showMonth: 7,
      showDay: 8,
      venue: "A",
    });
    const { result } = renderHook(() => useShow("1994-07-08"), { wrapper });
    await waitFor(() => expect(result.current.show).toBeDefined());
  });

  it("useShowsByDate groups shows", async () => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockResolvedValueOnce([
      { artistId: 1, showYear: 1994, showMonth: 7, showDay: 8, venue: "A" },
      { artistId: 1, showYear: 1994, showMonth: 7, showDay: 9, venue: "A" },
    ]);
    const { result } = renderHook(() => useShowsByDate(), { wrapper });
    await waitFor(() => expect(result.current.showsByDate).toBeDefined());
    expect(Object.keys(result.current.showsByDate || {})).toContain("1994");
  });

  it("useShowsByVenue groups and sorts", async () => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockResolvedValueOnce([
      { artistId: 1, showYear: 1995, showMonth: 7, showDay: 9, venue: "B" },
      { artistId: 1, showYear: 1994, showMonth: 7, showDay: 8, venue: "A" },
    ]);
    const { result } = renderHook(() => useShowsByVenue(), { wrapper });
    await waitFor(() => expect(Object.keys(result.current.showsByVenue).length).toBeGreaterThan(0));
    expect(Object.keys(result.current.showsByVenue)).toEqual(expect.arrayContaining(["A", "B"]));
  });
});


