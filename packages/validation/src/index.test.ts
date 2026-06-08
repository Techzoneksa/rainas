import { describe, expect, it } from "vitest";

import { parseAppEnvironment, parsePort } from "./index";

describe("validation primitives", () => {
  it("falls back to development for unknown environments", () => {
    expect(parseAppEnvironment("local")).toBe("development");
  });

  it("parses ports safely", () => {
    expect(parsePort("4000", 3000)).toBe(4000);
  });
});
