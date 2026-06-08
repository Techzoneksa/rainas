import { describe, expect, it } from "vitest";

import type { ApiResponse } from "./index";

describe("api contracts foundation", () => {
  it("supports typed success responses", () => {
    const response: ApiResponse<{ service: string }> = {
      data: {
        service: "raina-api"
      }
    };

    expect("data" in response).toBe(true);
  });
});
