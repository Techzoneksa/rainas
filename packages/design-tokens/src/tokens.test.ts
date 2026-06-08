import { describe, expect, it } from "vitest";

import { colors, tokens } from "./index";

describe("design tokens", () => {
  it("exposes Raina identity colors", () => {
    expect(colors.primaryYellow).toBe("#FFCE00");
    expect(tokens.colors.charcoalBlack).toBe("#171717");
  });
});
