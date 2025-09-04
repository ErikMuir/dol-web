import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

jest.mock("./Wallet", () => ({ Wallet: () => <div>Wallet</div> }));
jest.mock("./Nav", () => ({ Nav: () => <nav>Nav</nav> }));
jest.mock("../common/DiscordLink", () => ({ DiscordLink: () => <div>Discord</div> }));
jest.mock("../common/Shapes", () => ({ Shapes: () => <div>Shapes</div> }));

describe("Header and Footer", () => {
  it("renders Header contents", () => {
    render(<Header />);
    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.getByText("Nav")).toBeInTheDocument();
    expect(screen.getByText("Discord")).toBeInTheDocument();
    expect(screen.getByTitle("Can you still have fun?")).toBeInTheDocument();
  });

  it("renders Footer contents", () => {
    render(<Footer />);
    expect(screen.getByText("built on Hedera")).toBeInTheDocument();
    expect(screen.getByText("by RobotJones")).toBeInTheDocument();
  });
});


