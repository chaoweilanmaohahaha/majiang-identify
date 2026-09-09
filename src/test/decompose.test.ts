import { describe, expect, it } from "vitest";
import {
  canWin,
  canWinSequencesOnly,
  canWinTripletsOnly,
} from "@/core/mahjong/decompose";
import { toCounts } from "@/core/mahjong/judge";

describe("分解算法", () => {
  it("四顺子加将牌可分解", () => {
    const counts = toCounts([0, 1, 2, 3, 4, 5, 9, 10, 11, 18, 19, 20, 27, 27]);
    expect(canWin(counts, 0)).toBe(true);
    expect(canWinSequencesOnly(counts, 0)).toBe(true);
    expect(canWinTripletsOnly(counts, 0)).toBe(false);
  });

  it("四刻子加将牌可分解", () => {
    const counts = toCounts([
      0, 0, 0, 9, 9, 9, 18, 18, 18, 27, 27, 27, 28, 28,
    ]);
    expect(canWin(counts, 0)).toBe(true);
    expect(canWinSequencesOnly(counts, 0)).toBe(false);
    expect(canWinTripletsOnly(counts, 0)).toBe(true);
  });

  it("无法分解时返回 false", () => {
    const counts = toCounts([0, 1, 3, 4, 5, 9, 10, 11, 18, 19, 20, 27, 27, 27]);
    expect(canWin(counts, 0)).toBe(false);
  });

  it("考虑副露数量后的分解", () => {
    const counts = toCounts([9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28]);
    expect(canWin(counts, 1)).toBe(true);
  });

  it("暗牌四张相同可拆为刻子加顺子补张", () => {
    const counts = toCounts([
      0, 0, 0, 0, 1, 2, 3, 4, 5, 9, 10, 11, 28, 28,
    ]);
    expect(canWin(counts, 0)).toBe(true);
  });
});
