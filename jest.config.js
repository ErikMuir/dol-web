/** @type {import("jest").Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // CSS modules and static assets
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          allowImportingTsExtensions: true,
          module: "commonjs",
          esModuleInterop: true,
        },
        useESM: false,
      },
    ],
  },
  roots: ["<rootDir>/src"],
  // No coverage collection
};

module.exports = config;


