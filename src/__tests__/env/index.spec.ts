import { envIsDefined } from "../lib/utils/envIsDefined";

describe("🧰 Should be able to load .env.test file:", () => {
  it("Should be able to get all environment constants.", () => {
    const isDefined = envIsDefined();
    expect(isDefined).toBe(true);
  });

  it("Should be able to get a formatted Github private key.", () => {
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    expect(privateKey.includes("|")).toBe(true);
    expect(!privateKey.includes('\n')).toBe(true);
  });
});