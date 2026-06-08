import { describe, expect, it } from "vitest";

import { webAppConfig } from "./app";

describe("web foundation", () => {
  it("contains the Raina foundation name and message", () => {
    expect(webAppConfig.name).toContain("Raina");
    expect(webAppConfig.message).toBe("تم تأسيس تطبيق الويب بنجاح");
  });
});
