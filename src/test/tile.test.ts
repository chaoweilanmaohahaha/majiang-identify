import { describe, expect, it } from "vitest";
import {
  FLOWER_KIND_START,
  isFlower,
  isNumbered,
  isWind,
  rankOf,
  suitOf,
  TILE_KIND_COUNT,
  tileName,
} from "@/core/mahjong/tile";

describe("牌编码", () => {
  it("0-41 编码的名称唯一", () => {
    const names = new Map<string, number>();
    for (let tile = 0; tile < TILE_KIND_COUNT; tile++) {
      const name = tileName(tile);
      expect(names.has(name)).toBe(false);
      names.set(name, tile);
    }
    expect(names.size).toBe(42);
  });

  it("数牌名称正确", () => {
    expect(tileName(0)).toBe("1万");
    expect(tileName(8)).toBe("9万");
    expect(tileName(9)).toBe("1条");
    expect(tileName(17)).toBe("9条");
    expect(tileName(18)).toBe("1筒");
    expect(tileName(26)).toBe("9筒");
  });

  it("风牌名称正确", () => {
    expect(tileName(27)).toBe("东");
    expect(tileName(28)).toBe("南");
    expect(tileName(29)).toBe("西");
    expect(tileName(30)).toBe("北");
  });

  it("花牌名称正确（含红中发财白板）", () => {
    expect(tileName(31)).toBe("红中");
    expect(tileName(32)).toBe("发财");
    expect(tileName(33)).toBe("白板");
    expect(tileName(34)).toBe("春");
    expect(tileName(41)).toBe("菊");
  });

  it("红中发财白板按花牌归类", () => {
    expect(isFlower(31)).toBe(true);
    expect(isFlower(32)).toBe(true);
    expect(isFlower(33)).toBe(true);
    expect(isFlower(34)).toBe(true);
    expect(isFlower(41)).toBe(true);
    expect(isFlower(0)).toBe(false);
    expect(isFlower(27)).toBe(false);
    expect(isFlower(30)).toBe(false);
  });

  it("风牌与数牌判定", () => {
    expect(isWind(27)).toBe(true);
    expect(isWind(30)).toBe(true);
    expect(isWind(31)).toBe(false);
    expect(isNumbered(0)).toBe(true);
    expect(isNumbered(26)).toBe(true);
    expect(isNumbered(27)).toBe(false);
  });

  it("花色与数字", () => {
    expect(suitOf(0)).toBe(0);
    expect(suitOf(8)).toBe(0);
    expect(suitOf(9)).toBe(1);
    expect(suitOf(18)).toBe(2);
    expect(suitOf(26)).toBe(2);
    expect(suitOf(27)).toBeNull();
    expect(rankOf(0)).toBe(1);
    expect(rankOf(8)).toBe(9);
    expect(rankOf(13)).toBe(5);
  });

  it("花牌区间从 31 开始", () => {
    expect(FLOWER_KIND_START).toBe(31);
  });
});
