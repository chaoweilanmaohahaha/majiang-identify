export type TileId = number;

export type MeldKind = "chi" | "peng" | "gang";

export interface Meld {
  tiles: TileId[];
  kind: MeldKind;
}

export interface HandInput {
  concealed: TileId[];
  melds: Meld[];
  flowers: TileId[];
}

export enum HuType {
  MenqingPinghu = "menqing-pinghu",
  PengpengHu = "pengpeng-hu",
  Qingyise = "qing-yi-se",
  Hunyise = "hun-yi-se",
}

export class MahjongInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MahjongInputError";
  }
}
