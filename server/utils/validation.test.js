const expect = require("expect");

const { isRealString } = require("./../utils/validation");

describe("isRealString", () => {
  it("should reject non-string values", () => {
    expect(isRealString(234)).toBe(false);
  });

  it("should reject string with only space", () => {
    expect(isRealString(" ")).toBe(false);
  });

  it("should allow string with non-space character", () => {
    expect(isRealString("indra")).toBe(true);
  });
});
