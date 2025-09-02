import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import * as Utils from "@/utils";
import { useSong, useSongs } from "../use-songs";

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  fetchStandardJson: jest.fn(),
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe("use-songs hooks", () => {
  beforeEach(() => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockReset();
  });

  it("useSongs returns data", async () => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockResolvedValueOnce([{ id: 1 }] as any);
    const { result } = renderHook(() => useSongs(), { wrapper });
    await waitFor(() => expect(result.current.songs).toBeDefined());
  });

  it("useSong returns data when id provided", async () => {
    (Utils.fetchStandardJson as unknown as jest.Mock).mockResolvedValueOnce({ id: 1 } as any);
    const { result } = renderHook(() => useSong(1), { wrapper });
    await waitFor(() => expect(result.current.song).toBeDefined());
  });

  it("useSong does not fetch when id is undefined", async () => {
    const spy = Utils.fetchStandardJson as unknown as jest.Mock;
    renderHook(() => useSong(undefined), { wrapper });
    expect(spy).not.toHaveBeenCalled();
  });
});


