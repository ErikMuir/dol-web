import "@testing-library/jest-dom";
import "whatwg-fetch";

// Mocks for next modules typically used in components
jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => "/",
  };
});

// Avoid JSX in a TS setup file to prevent transform issues
jest.mock("next/image", () => ({ __esModule: true, default: (props: any) => {
  const React = require("react");
  return React.createElement("img", props);
}}));

// Some tests import next/server types or helpers indirectly; provide a basic mock
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: any) => new Response(JSON.stringify(body), init),
  },
}));

// Provide minimal mocks for ESM-only dol-lib modules to avoid transform errors
jest.mock("@erikmuir/dol-lib/common/utils", () => ({
  padLeft: (value: string, length: number) => String(value).padStart(length, "0"),
}));

jest.mock("@erikmuir/dol-lib/common/dapp", () => ({
  getDolBackgroundColorClass: () => "bg-gray-500",
  getDolBorderColorClass: () => "border-gray-500",
  getLyricByCategory: () => ["lyric-line-1", "lyric-line-2"],
  sortByShowDate: () => 0,
}));

// Polyfills for supertest/Node libs expecting Web APIs
// TextEncoder/TextDecoder are used by dependency chains (e.g., noble/hashes)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require("util");
  // @ts-ignore
  global.TextEncoder = global.TextEncoder || TextEncoder;
  // @ts-ignore
  global.TextDecoder = global.TextDecoder || TextDecoder;
} catch {}


