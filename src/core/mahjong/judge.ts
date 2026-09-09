import { canWin, canWinSequencesOnly, canWinTripletsOnly } from "./decompose";
import {
  isFlower,
  isNumbered,
  isValidTile,
  isWind,
  TILE_KIND_COUNT,
} from "./tile";
import type { HandInput, Meld, TileId } from "./types";
import { HuType, MahjongInputError } from "./types";

export function toCounts(tiles: TileId[]): number[] {
  const counts = new Array<number>(TILE_KIND_COUNT).fill(0);
  for (const tile of tiles) {
    counts[tile]++;
  }
  return counts;
}

export function countAcross(input: HandInput): number[] {
  const counts = toCounts(input.concealed);
  for (const meld of input.melds) {
    for (const tile of meld.tiles) {
      counts[tile]++;
    }
  }
  return counts;
}

function assertPlayable(tile: number, context: string): void {
  if (!isValidTile(tile)) {
    throw new MahjongInputError(`${context}: 非法牌编码 ${tile}`);
  }
  if (isFlower(tile)) {
    throw new MahjongInputError(
      `${context}: 花牌（${tile}）必须放在 flowers 字段中，不能出现在暗牌或副露中`
    );
  }
}

function validateMeld(meld: Meld): void {
  const { tiles, kind } = meld;
  if (kind === "gang") {
    if (tiles.length !== 4) {
      throw new MahjongInputError("杠必须为四张相同的牌");
    }
    if (!tiles.every((t) => t === tiles[0])) {
      throw new MahjongInputError("杠的四张牌必须相同");
    }
  } else if (kind === "peng") {
    if (tiles.length !== 3) {
      throw new MahjongInputError("碰必须为三张相同的牌");
    }
    if (!tiles.every((t) => t === tiles[0])) {
      throw new MahjongInputError("碰的三张牌必须相同");
    }
  } else if (kind === "chi") {
    if (tiles.length !== 3) {
      throw new MahjongInputError("吃必须为三张牌");
    }
    const sorted = [...tiles].sort((a, b) => a - b);
    const isSequence =
      sorted[0] <= 26 &&
      sorted[0] % 9 <= 6 &&
      sorted[1] === sorted[0] + 1 &&
      sorted[2] === sorted[0] + 2;
    if (!isSequence) {
      throw new MahjongInputError("吃必须为同一花色的连续三张数牌");
    }
  } else {
    throw new MahjongInputError(`未知副露类型: ${String(kind)}`);
  }
  for (const tile of tiles) {
    assertPlayable(tile, "副露");
  }
}

export function validateInput(input: HandInput, expectedTotal: 13 | 14): void {
  for (const tile of input.concealed) {
    assertPlayable(tile, "暗牌");
  }
  for (const tile of input.flowers) {
    if (!isFlower(tile)) {
      throw new MahjongInputError(
        `花牌字段只能包含花牌编码（31-41），收到 ${tile}`
      );
    }
  }
  for (const meld of input.melds) {
    validateMeld(meld);
  }

  const counts = countAcross(input);
  for (let i = 0; i < TILE_KIND_COUNT; i++) {
    if (counts[i] > 4) {
      throw new MahjongInputError(`第 ${i} 种牌（${i}）合计超过四张`);
    }
  }
  const flowerCounts = toCounts(input.flowers);
  for (let i = 0; i < TILE_KIND_COUNT; i++) {
    if (flowerCounts[i] > 4) {
      throw new MahjongInputError(`花牌 ${i} 超过四张`);
    }
  }

  const total = input.concealed.length + 3 * input.melds.length;
  if (total !== expectedTotal) {
    throw new MahjongInputError(
      `暗牌加副露折算张数应为 ${expectedTotal}，实际为 ${total}`
    );
  }
  const expectedRemainder = expectedTotal === 14 ? 2 : 1;
  if (input.concealed.length % 3 !== expectedRemainder) {
    throw new MahjongInputError(
      `暗牌张数 ${input.concealed.length} 不符合 ${expectedTotal} 张要求（模 3 余 ${expectedRemainder}）`
    );
  }
}

export function canWinHand(input: HandInput): boolean {
  return canWin(toCounts(input.concealed), input.melds.length);
}

export function isWinningHand(input: HandInput): boolean {
  validateInput(input, 14);
  return canWinHand(input);
}

export function getWinTypes(input: HandInput): HuType[] {
  validateInput(input, 14);
  if (!canWinHand(input)) {
    return [];
  }

  const types: HuType[] = [];
  const concealedCounts = toCounts(input.concealed);
  const meldCount = input.melds.length;

  if (meldCount === 0 && canWinSequencesOnly(concealedCounts, 0)) {
    types.push(HuType.MenqingPinghu);
  }

  const hasChi = input.melds.some((meld) => meld.kind === "chi");
  if (!hasChi && canWinTripletsOnly(concealedCounts, meldCount)) {
    types.push(HuType.PengpengHu);
  }

  const allTiles = [
    ...input.concealed,
    ...input.melds.flatMap((meld) => meld.tiles),
  ];
  const suits = new Set<number>();
  let hasWind = false;
  let hasNonWindNonNumbered = false;
  for (const tile of allTiles) {
    if (isNumbered(tile)) {
      suits.add(Math.floor(tile / 9));
    } else if (isWind(tile)) {
      hasWind = true;
    } else {
      hasNonWindNonNumbered = true;
    }
  }
  const onlyNumbered = !hasWind && !hasNonWindNonNumbered;
  if (onlyNumbered && suits.size === 1 && allTiles.length > 0) {
    types.push(HuType.Qingyise);
  }
  if (hasWind && !hasNonWindNonNumbered && suits.size === 1) {
    types.push(HuType.Hunyise);
  }

  return types;
}
