export type SetMode = "any" | "sequences" | "triplets";

function firstNonZero(counts: number[]): number {
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0) return i;
  }
  return -1;
}

function search(
  counts: number[],
  setsLeft: number,
  pairDone: boolean,
  mode: SetMode
): boolean {
  const i = firstNonZero(counts);
  if (i === -1) {
    return setsLeft === 0 && pairDone;
  }

  if (!pairDone && counts[i] >= 2) {
    counts[i] -= 2;
    if (search(counts, setsLeft, true, mode)) {
      counts[i] += 2;
      return true;
    }
    counts[i] += 2;
  }

  if (setsLeft > 0) {
    if (
      (mode === "any" || mode === "sequences") &&
      i <= 26 &&
      i % 9 <= 6 &&
      counts[i + 1] > 0 &&
      counts[i + 2] > 0
    ) {
      counts[i] -= 1;
      counts[i + 1] -= 1;
      counts[i + 2] -= 1;
      if (search(counts, setsLeft - 1, pairDone, mode)) {
        counts[i] += 1;
        counts[i + 1] += 1;
        counts[i + 2] += 1;
        return true;
      }
      counts[i] += 1;
      counts[i + 1] += 1;
      counts[i + 2] += 1;
    }

    if ((mode === "any" || mode === "triplets") && counts[i] >= 3) {
      counts[i] -= 3;
      if (search(counts, setsLeft - 1, pairDone, mode)) {
        counts[i] += 3;
        return true;
      }
      counts[i] += 3;
    }
  }

  return false;
}

export function canWin(counts: number[], meldCount: number): boolean {
  return search([...counts], 4 - meldCount, false, "any");
}

export function canWinSequencesOnly(
  counts: number[],
  meldCount: number
): boolean {
  return search([...counts], 4 - meldCount, false, "sequences");
}

export function canWinTripletsOnly(
  counts: number[],
  meldCount: number
): boolean {
  return search([...counts], 4 - meldCount, false, "triplets");
}
