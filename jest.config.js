const nextJest = require("next/jest");
const createJestConfig = nextJest({ 
  dir: "./"
});

module.exports = createJestConfig({
	setupFilesAfterEnv: [
	  "<rootDir>/src/@tests/jest.setup.ts"
	],
	testEnvironment: "jsdom"
});