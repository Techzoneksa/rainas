import { describe, expect, it } from "vitest";

import { adminAppConfig } from "./app";

describe("admin foundation", () => {
  it("contains the owner dashboard foundation message", () => {
    expect(adminAppConfig.name).toBe("Raina Owner Dashboard");
    expect(adminAppConfig.message).toBe("لوحة الإدارة قيد التأسيس");
  });
});
