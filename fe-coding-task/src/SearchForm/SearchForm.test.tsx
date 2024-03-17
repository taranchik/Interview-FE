import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SearchForm from "./index";
import {
  searchFormMockData,
  quartersRangeRequiredMsg,
  houseTypeRequiredMsg,
} from "./mock";

describe("SearchForm Component", () => {
  it("renders correctly", () => {
    render(<SearchForm {...searchFormMockData} />);

    expect(screen.getByText("Search Form")).toBeDefined();

    expect(screen.getByText("Quarters Range:")).toBeDefined();
    expect(document.getElementById("quartersRange")).toBeDefined();

    expect(screen.getByText("House Type:")).toBeDefined();
    expect(document.getElementById("houseType")).toBeDefined();

    expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
  });

  it("displays error message when quarters range input validation fails", async () => {
    const errorValidationMsg = "Validation failed";
    const validateQuartersRange = vi.fn().mockReturnValue(errorValidationMsg);

    render(
      <SearchForm
        {...searchFormMockData}
        validateQuartersRange={validateQuartersRange}
      />
    );

    const inputElement = document.getElementById(
      "quartersRange"
    ) as HTMLInputElement | null;

    if (inputElement) {
      inputElement.value = "invalid data";
    } else {
      throw new Error("Quarters range input does not exist");
    }

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(errorValidationMsg)).toBeDefined();
  });

  it("displays error message when quarters range input empty", async () => {
    render(<SearchForm {...searchFormMockData} />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(quartersRangeRequiredMsg)).toBeDefined();
  });

  it("displays error message when house type is not selected", async () => {
    render(<SearchForm {...searchFormMockData} />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(houseTypeRequiredMsg)).toBeDefined();
  });

  it("On press submit button calls onSubmit", async () => {
    const validateQuartersRange = vi.fn().mockReturnValue(true);
    const validateHouseType = vi.fn().mockReturnValue(true);

    render(
      <SearchForm
        {...searchFormMockData}
        validateQuartersRange={validateQuartersRange}
        validateHouseType={validateHouseType}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(searchFormMockData.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
