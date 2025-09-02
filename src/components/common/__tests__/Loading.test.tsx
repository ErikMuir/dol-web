import { render } from "@testing-library/react";
import { Loading } from "../Loading";

jest.mock("@erikmuir/dol-lib/common/dapp", () => ({
  getLyricByCategory: () => [
    [{ text: "line1" }],
    [{ text: "line2", highlight: true }],
  ],
  getDolBackgroundColorClass: () => "bg-gray-500",
  getDolBorderColorClass: () => "border-gray-500",
  getDolTextColorClass: () => "text-gray-500",
  getPseudoRandomDolColorClass: () => "dol-blue",
}));

describe("Loading", () => {
  it("renders without crashing", () => {
    const { container } = render(<Loading sizeInPixels={100} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders lyric when showLyric is true", () => {
    const { getByText } = render(<Loading showLyric />);
    expect(getByText("line1")).toBeInTheDocument();
    expect(getByText("line2")).toBeInTheDocument();
  });
});


