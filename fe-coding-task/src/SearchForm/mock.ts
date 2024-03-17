import { SearchFormProps } from "./types";
import { vi } from "vitest";

export const quartersRangeRequiredMsg = "Quarters range is required!";
export const houseTypeRequiredMsg = "House type is required!";

export const searchFormMockData: SearchFormProps = {
  onSubmit: vi.fn(),
  validateQuartersRange: vi.fn((value) =>
    value ? true : quartersRangeRequiredMsg
  ),
  validateHouseType: vi.fn((value) => (value ? true : houseTypeRequiredMsg)),
};
