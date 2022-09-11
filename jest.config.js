/** @type {import('jest').Config} */
const config = {
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
  moduleFileExtensions: ["ts", "js", "json", "node"],
  reporters: ["default", "github-actions"],
};

module.exports = config;
