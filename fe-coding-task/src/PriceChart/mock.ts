import { PriceChartProps } from "./types";
import { vi } from "vitest";

export const quartersRangeRequiredMsg = "Quarters range is required!";
export const houseTypeRequiredMsg = "House type is required!";

export const priceChartMockData: PriceChartProps = {
  quartersRange: "2015K1-2021K4",
  houseType: "Boliger i alt",
  validateQuartersRange: vi.fn((value) =>
    value ? true : quartersRangeRequiredMsg
  ),
  validateHouseType: vi.fn((value) => (value ? true : houseTypeRequiredMsg)),
  parseQuaterRange: vi.fn((fromToQuarter: string) => {
    // Split the range into start and end
    const [start, end] = fromToQuarter.split("-");

    // Extract the year and quarter for both start and end
    const [startYear, startQuarter] = start.split("K").map(Number);
    const [endYear, endQuarter] = end.split("K").map(Number);

    return { startYear, startQuarter, endYear, endQuarter };
  }),
};
