import { describe, expect, it } from "vitest";

import { color, colors, motion, radius, tokens, touch } from "./index";

describe("design tokens", () => {
  it("exposes Raina identity colors", () => {
    expect(colors.primaryYellow).toBe("#FFCE00");
    expect(color.brand.primary).toBe("#FFCE00");
    expect(tokens.colors.charcoalBlack).toBe("#171717");
  });

  it("exposes shared foundation scales", () => {
    expect(radius.full).toBe("9999px");
    expect(motion.duration.normal).toBe("180ms");
    expect(touch.targetMin).toBe("44px");
  });
});
