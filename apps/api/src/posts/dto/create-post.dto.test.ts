import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CreatePostDto } from "./create-post.dto";

describe("CreatePostDto", () => {
  it("rejects ratings outside the 1 to 10 range", async () => {
    const dto = new CreatePostDto();
    dto.productId = "prd_01";
    dto.rating = 11;
    dto.title = "تجربة";
    dto.body = "نص تجربة صالح للاختبار.";

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === "rating")).toBe(true);
  });
});
