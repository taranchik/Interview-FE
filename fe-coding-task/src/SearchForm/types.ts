import { HouseType } from "../houseTypeOptions";

export interface SearchFormProps {
  onSubmit: (data: SearchParams) => void;
  validateQuartersRange(value: string): string | boolean;
  validateHouseType(value: string): string | boolean;
}

export type SearchParams = {
  quartersRange: string;
  houseType: HouseType;
};
