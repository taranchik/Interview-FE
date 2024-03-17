import { HouseType } from "../houseTypeOptions";

export interface PriceChartProps {
  quartersRange: string;
  houseType: HouseType;
  validateQuartersRange(value: string): string | boolean;
  validateHouseType(value: string): string | boolean;
  parseQuaterRange(value: string): parsedQuaterRange;
}

type parsedQuaterRange = {
  startYear: number;
  startQuarter: number;
  endYear: number;
  endQuarter: number;
};

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};
