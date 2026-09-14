import { describe, expect, it } from "vitest";
import { recognizeHand } from "@/core/mahjong/recognize";

describe("recognizeHand 占位识别接口", () => {
  it("返回 Promise 并 resolve 空牌列表", async () => {
    const result = await recognizeHand("tmp://test.png");
    expect(result).toEqual([]);
  });
});
