export interface SearchParams {
  quartersRange: string;
  houseType: HouseType;
}

export const houseTypeOptions = {
  "Boliger i alt": "00",
  Småhus: "02",
  Blokkleiligheter: "03",
} as const;

export type HouseType = keyof typeof houseTypeOptions;
