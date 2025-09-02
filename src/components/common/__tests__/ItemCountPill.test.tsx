import { render, screen } from "@testing-library/react";
import { ItemCountPill } from "../ItemCountPill";

describe("ItemCountPill", () => {
  it("renders singular/plural correctly", () => {
    const { rerender } = render(<ItemCountPill item="song" count={1} seed={0} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("song")).toBeInTheDocument();

    rerender(<ItemCountPill item="song" count={2} seed={1} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("songs")).toBeInTheDocument();
  });

  it("respects hidden", () => {
    const { container } = render(<ItemCountPill item="track" count={3} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});


