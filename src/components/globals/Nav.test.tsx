import { render, screen } from "@testing-library/react";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders tabs and back button", () => {
    render(<Nav />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});


