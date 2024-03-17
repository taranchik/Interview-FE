import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./index";

describe("App Component", () => {
  it("renders SearchForm when search params are not defined", () => {
    render(<App />);

    expect(screen.getByText("Search Form")).toBeDefined();
  });

  it("parses URL search params, sets state and renders PriceChart", async () => {
    const testUrl =
      "http://example.com/?quartersRange=2015K1-2021K4&houseType=Boliger%20i%20alt";

    window.location = new URL(testUrl) as any;

    render(<App />);

    // Make sure chart is visible
    await waitFor(
      () => {
        expect(screen.getByRole("img")).toBeDefined();
      },
      { timeout: 5000 }
    );
  });
});
