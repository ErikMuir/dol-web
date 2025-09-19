import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders Footer contents", () => {
    render(<Footer />);
    expect(screen.getByText("built on Hedera")).toBeInTheDocument();
    expect(screen.getByText("by RobotJones")).toBeInTheDocument();
  });
});


