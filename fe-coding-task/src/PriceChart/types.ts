import { HouseType } from "../SearchForm/types";

export interface PriceChartProps {
  quartersRange: string;
  houseType: HouseType;
}

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
