import { canWinHand, countAcross, validateInput } from "./judge";
import { PLAYABLE_KIND_COUNT } from "./tile";
import type { HandInput, TileId } from "./types";

export function getListeningTiles(input: HandInput): TileId[] {
  validateInput(input, 13);
  const used = countAcross(input);
  const result: TileId[] = [];
  for (let tile = 0; tile < PLAYABLE_KIND_COUNT; tile++) {
    if (used[tile] >= 4) continue;
    if (canWinHand({ ...input, concealed: [...input.concealed, tile] })) {
      result.push(tile);
    }
  }
  return result;
}
