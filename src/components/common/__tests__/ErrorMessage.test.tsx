import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

it("renders message", () => {
  render(<ErrorMessage message="Oops" />);
  expect(screen.getByText("Oops")).toBeInTheDocument();
});


