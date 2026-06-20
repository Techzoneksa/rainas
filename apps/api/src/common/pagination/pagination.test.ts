import { describe, expect, it } from "vitest";

import { createPageResult, getPagination } from "./pagination";

describe("pagination helpers", () => {
  it("calculates skip/take from page and limit", () => {
    expect(getPagination(3, 10)).toEqual({ skip: 20, take: 10 });
  });

  it("returns page metadata", () => {
    expect(createPageResult(["a", "b"], 11, 2, 5)).toEqual({
      data: ["a", "b"],
      meta: {
        page: 2,
        limit: 5,
        total: 11,
        totalPages: 3
      }
    });
  });
});
