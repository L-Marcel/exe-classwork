const nextJest = require("next/jest");
const createJestConfig = nextJest({ 
  dir: "./"
});

module.exports = createJestConfig({
	setupFilesAfterEnv: [
	  "<rootDir>/src/__tests__/lib/jest.setup.ts"
	],
  testPathIgnorePatterns: [
    "/src/__tests__/lib/"
  ],
	testEnvironment: "jest-environment-jsdom"
});