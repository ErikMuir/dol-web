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


