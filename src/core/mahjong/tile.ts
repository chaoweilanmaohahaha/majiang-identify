export const TILE_KIND_COUNT = 42;
export const PLAYABLE_KIND_COUNT = 31;
export const FLOWER_KIND_START = 31;

export const WIND_START = 27;
export const WIND_END = 30;

const NUMBER_SUITS = ["万", "条", "筒"];
const WINDS = ["东", "南", "西", "北"];
const DRAGONS = ["红中", "发财", "白板"];
const SEASON_FLOWERS = ["春", "夏", "秋", "冬", "梅", "兰", "竹", "菊"];

export function isValidTile(tile: number): boolean {
  return Number.isInteger(tile) && tile >= 0 && tile < TILE_KIND_COUNT;
}

export function isNumbered(tile: number): boolean {
  return tile >= 0 && tile <= 26;
}

export function isWind(tile: number): boolean {
  return tile >= WIND_START && tile <= WIND_END;
}

export function isFlower(tile: number): boolean {
  return tile >= FLOWER_KIND_START && tile < TILE_KIND_COUNT;
}

export function suitOf(tile: number): number | null {
  return isNumbered(tile) ? Math.floor(tile / 9) : null;
}

export function rankOf(tile: number): number | null {
  return isNumbered(tile) ? (tile % 9) + 1 : null;
}

export function tileName(tile: number): string {
  if (!isValidTile(tile)) {
    throw new RangeError(`invalid tile code: ${tile}`);
  }
  if (isNumbered(tile)) {
    return `${rankOf(tile)}${NUMBER_SUITS[Math.floor(tile / 9)]}`;
  }
  if (isWind(tile)) {
    return WINDS[tile - WIND_START];
  }
  if (tile <= 33) {
    return DRAGONS[tile - 31];
  }
  return SEASON_FLOWERS[tile - 34];
}
