import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PriceChart from "./index";
import {
  priceChartMockData,
  quartersRangeRequiredMsg,
  houseTypeRequiredMsg,
} from "./mock";
import { HouseType } from "../houseTypeOptions";

describe("PriceChart", () => {
  it("displays loading indicator initially", async () => {
    render(<PriceChart {...priceChartMockData} />);

    // Make sure spinner is visible
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

  it("displays chart data after successful fetch", async () => {
    render(<PriceChart {...priceChartMockData} />);

    // Make sure chart is visible
    await waitFor(
      () => {
        expect(screen.getByRole("img")).toBeDefined();
      },
      { timeout: 5000 }
    );
  });

  it("displays error message when quarters range has invalid format", async () => {
    const quartersRange = "invalid data";
    const errorValidationMsg =
      "Valid Quater Range shoulbe be in the format YYYYKQ-YYYYKQ!";
    const validateQuartersRange = vi.fn().mockReturnValue(errorValidationMsg);

    render(
      <PriceChart
        {...priceChartMockData}
        validateQuartersRange={validateQuartersRange}
        quartersRange={quartersRange}
      />
    );

    expect(await screen.findByText(errorValidationMsg)).toBeDefined();
  });

  it("displays error message when quarters range empty", async () => {
    const quartersRange = "";

    render(
      <PriceChart {...priceChartMockData} quartersRange={quartersRange} />
    );

    expect(await screen.findByText(quartersRangeRequiredMsg)).toBeDefined();
  });

  it("displays error message when house type has invalid format", async () => {
    const houseType = "invalid data";
    const errorValidationMsg =
      "House type should be one of the following: Boliger i alt, Småhus, Blokkleiligheter";
    const validateHouseType = vi.fn().mockReturnValue(errorValidationMsg);

    render(
      <PriceChart
        {...priceChartMockData}
        houseType={houseType as HouseType}
        validateHouseType={validateHouseType}
      />
    );

    expect(await screen.findByText(errorValidationMsg)).toBeDefined();
  });

  it("displays error message when house type is empty", async () => {
    const houseType = "" as HouseType;

    render(<PriceChart {...priceChartMockData} houseType={houseType} />);

    expect(await screen.findByText(houseTypeRequiredMsg)).toBeDefined();
  });

  it("displays error message on fetch failure", async () => {
    const houseType = "Random" as HouseType;

    render(<PriceChart {...priceChartMockData} houseType={houseType} />);

    // Make sure error is visible
    await waitFor(
      () => {
        const errorMessage = screen.getByText((content, _element) =>
          content.startsWith("Error:")
        );

        expect(errorMessage).toBeDefined();
      },
      { timeout: 5000 }
    );
  });
});
