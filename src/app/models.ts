interface CsvRow {
  issue: string;
  [candidate: string]: string;
}

type WeightDictionary = Record<string, number>;

export type { CsvRow, WeightDictionary };
