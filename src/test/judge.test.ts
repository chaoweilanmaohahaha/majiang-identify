import { describe, expect, it } from "vitest";
import type { HandInput } from "@/core/mahjong/types";
import { HuType, MahjongInputError } from "@/core/mahjong/types";
import { getWinTypes, isWinningHand, validateInput } from "@/core/mahjong/judge";

function hand(
  concealed: number[],
  melds: HandInput["melds"] = [],
  flowers: number[] = []
): HandInput {
  return { concealed, melds, flowers };
}

describe("输入校验", () => {
  it("非法牌编码报错", () => {
    expect(() => validateInput(hand([99, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), 14)).toThrow(
      MahjongInputError
    );
  });

  it("花牌混入暗牌报错", () => {
    expect(() =>
      validateInput(
        hand([31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
        14
      )
    ).toThrow(MahjongInputError);
  });

  it("非花牌放入花牌字段报错", () => {
    expect(() =>
      validateInput(hand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [], [0]), 14)
    ).toThrow(MahjongInputError);
  });

  it("同种牌合计超过四张报错", () => {
    expect(() =>
      validateInput(hand([0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 14)
    ).toThrow(MahjongInputError);
  });

  it("张数不符合要求报错", () => {
    expect(() => validateInput(hand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), 14)).toThrow(
      MahjongInputError
    );
    expect(() => validateInput(hand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]), 13)).toThrow(
      MahjongInputError
    );
  });

  it("非法副露报错", () => {
    expect(() =>
      validateInput(
        hand([9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28], [
          { tiles: [0, 1, 3], kind: "chi" },
        ]),
        14
      )
    ).toThrow(MahjongInputError);
  });

  it("合法输入通过", () => {
    expect(() =>
      validateInput(hand([0, 1, 2, 3, 4, 5, 9, 10, 11, 18, 19, 20, 27, 27]), 14)
    ).not.toThrow();
  });
});

describe("胡牌判定", () => {
  it("基本胡牌", () => {
    const input = hand([0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28]);
    expect(isWinningHand(input)).toBe(true);
  });

  it("无法拆分时未胡牌", () => {
    const input = hand([0, 1, 3, 4, 5, 9, 10, 11, 18, 19, 20, 27, 27, 27]);
    expect(isWinningHand(input)).toBe(false);
  });

  it("含副露（吃）的胡牌", () => {
    const input = hand([9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28], [
      { tiles: [0, 1, 2], kind: "chi" },
    ]);
    expect(isWinningHand(input)).toBe(true);
  });

  it("杠作为面子的胡牌", () => {
    const input = hand([9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28], [
      { tiles: [0, 0, 0, 0], kind: "gang" },
    ]);
    expect(isWinningHand(input)).toBe(true);
  });

  it("花牌不影响胡牌", () => {
    const input = hand(
      [0, 1, 2, 9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28],
      [],
      [34, 31, 31]
    );
    expect(isWinningHand(input)).toBe(true);
  });
});

describe("胡牌类型识别", () => {
  it("门清平胡", () => {
    const input = hand([0, 1, 2, 3, 4, 5, 9, 10, 11, 18, 19, 20, 27, 27]);
    const types = getWinTypes(input);
    expect(types).toContain(HuType.MenqingPinghu);
    expect(types).not.toContain(HuType.PengpengHu);
  });

  it("碰碰胡", () => {
    const input = hand([0, 0, 0, 9, 9, 9, 18, 18, 18, 27, 27, 27, 28, 28]);
    const types = getWinTypes(input);
    expect(types).toContain(HuType.PengpengHu);
    expect(types).not.toContain(HuType.MenqingPinghu);
  });

  it("清一色", () => {
    const input = hand([0, 1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2]);
    const types = getWinTypes(input);
    expect(types).toContain(HuType.Qingyise);
  });

  it("混一色（单一花色加风牌）", () => {
    const input = hand([0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 27, 27]);
    const types = getWinTypes(input);
    expect(types).toContain(HuType.Hunyise);
    expect(types).not.toContain(HuType.Qingyise);
  });

  it("类型可叠加（门清平胡+清一色）", () => {
    const input = hand([0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 3]);
    const types = getWinTypes(input);
    expect(types).toContain(HuType.MenqingPinghu);
    expect(types).toContain(HuType.Qingyise);
  });

  it("未胡牌时类型为空", () => {
    const input = hand([0, 1, 3, 4, 5, 9, 10, 11, 18, 19, 20, 27, 27, 27]);
    expect(getWinTypes(input)).toEqual([]);
  });

  it("有副露时不是门清平胡", () => {
    const input = hand([9, 10, 11, 18, 19, 20, 27, 27, 27, 28, 28], [
      { tiles: [0, 1, 2], kind: "chi" },
    ]);
    const types = getWinTypes(input);
    expect(types).not.toContain(HuType.MenqingPinghu);
  });

  it("有吃副露时不是碰碰胡", () => {
    const input = hand([9, 9, 9, 18, 18, 18, 27, 27, 27, 28, 28], [
      { tiles: [0, 1, 2], kind: "chi" },
    ]);
    const types = getWinTypes(input);
    expect(types).not.toContain(HuType.PengpengHu);
  });
});
