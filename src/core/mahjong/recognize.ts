import type { TileId } from "./types";

export function recognizeHand(imagePath: string): Promise<TileId[]> {
  void imagePath;
  return Promise.resolve([]);
}
