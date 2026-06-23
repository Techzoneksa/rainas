import { afterEach, describe, expect, it, vi } from "vitest";

import { apiRequest, buildQueryString } from "./client";

describe("web api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("builds query params without empty values", () => {
    expect(
      buildQueryString({
        q: "سيروم",
        categoryId: "cat_skincare",
        empty: "",
        page: 1
      })
    ).toBe("?q=%D8%B3%D9%8A%D8%B1%D9%88%D9%85&categoryId=cat_skincare&page=1");
  });

  it("returns typed data on success", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://api.local/api/v1");
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(JSON.stringify({ data: { id: "prd_01" } }), {
          status: 200,
          headers: { "content-type": "application/json" }
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await apiRequest<{ data: { id: string } }>("/products/prd_01");
    const [url] = fetchMock.mock.calls[0] ?? [];

    expect(url).toBe("http://api.local/api/v1/products/prd_01");
    expect(response.data.id).toBe("prd_01");
  });

  it("normalizes api errors", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://api.local/api/v1");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ code: "PRODUCT_NOT_FOUND", message: "غير موجود" }), {
            status: 404,
            headers: { "content-type": "application/json", "x-request-id": "req_01" }
          })
      )
    );

    await expect(apiRequest("/products/missing")).rejects.toMatchObject({
      status: 404,
      apiError: {
        code: "PRODUCT_NOT_FOUND",
        message: "غير موجود",
        requestId: "req_01"
      }
    });
  });
});
