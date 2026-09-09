import { describe, expect, it } from "vitest";
import type { HandInput } from "@/core/mahjong/types";
import { getListeningTiles } from "@/core/mahjong/listen";

function hand(
  concealed: number[],
  melds: HandInput["melds"] = [],
  flowers: number[] = []
): HandInput {
  return { concealed, melds, flowers };
}

describe("听牌判定", () => {
  it("两面听（4万5万 搭子）", () => {
    const input = hand([0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 27, 3, 4]);
    expect(getListeningTiles(input)).toEqual([2, 5]);
  });

  it("将牌单钓", () => {
    const input = hand([0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 27, 27, 28]);
    expect(getListeningTiles(input)).toEqual([28]);
  });

  it("未听牌时听口为空", () => {
    const input = hand([0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 0, 9, 18]);
    expect(getListeningTiles(input)).toEqual([]);
  });

  it("含副露的听牌", () => {
    const input = hand([9, 10, 11, 18, 19, 20, 27, 27, 3, 4], [
      { tiles: [0, 1, 2], kind: "chi" },
    ]);
    expect(getListeningTiles(input)).toEqual([2, 5]);
  });

  it("听口不含花牌", () => {
    const input = hand(
      [0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 27, 3, 4],
      [],
      [31, 32, 33, 34]
    );
    const tiles = getListeningTiles(input);
    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles.every((t) => t < 31)).toBe(true);
  });

  it("已有四张的牌不作为听口", () => {
    const input = hand([0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const tiles = getListeningTiles(input);
    expect(tiles).not.toContain(0);
  });
});
