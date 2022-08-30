/** @type {import('jest').Config} */

module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "src/tsconfig.jest.json",
    },
  },
  preset: "jest-puppeteer",
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
