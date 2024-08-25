export type SearchOption = {
  url: string;
  target: string[];
  format: (p: { [key: string]: string }) => string;
  place_type: string[];
  placeholder: string;
  zoom: number;
  maxItems?: number;
  sortItems?: (
    a: { [key: string]: number },
    b: { [key: string]: number },
  ) => number;
  matchAllKeywords?: boolean;
  sortByMatchedKeywords?: boolean;
};
