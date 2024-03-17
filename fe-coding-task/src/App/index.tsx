import React, { useState, useEffect, Suspense } from "react";
import { houseTypeOptions, HouseType } from "../houseTypeOptions.ts";
import { SearchParamsHistory } from "./types.ts";
import { Container } from "@mui/material";
import { SearchParams } from "../SearchForm/types.ts";
import { CircularProgress } from "@mui/material";

const SearchForm = React.lazy(() => import("../SearchForm/index.tsx"));
const PriceChart = React.lazy(() => import("../PriceChart/index.tsx"));

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    quartersRange: "",
    houseType: "Boliger i alt",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const quartersRange: string | null = queryParams.get("quartersRange");
    const houseType: string | null = queryParams.get("houseType");

    if (quartersRange && houseType) {
      const isValidQuatersRange = validateQuartersRange(quartersRange);
      const isValidHouseType = validateHouseType(houseType);

      // Check if both parameters are valid
      if (isValidQuatersRange === true && isValidHouseType === true) {
        setSearchParams({
          quartersRange,
          houseType: houseType as HouseType,
        });
      }
    }
  }, []);

  const parseQuaterRange = (fromToQuarter: string) => {
    // Split the range into start and end
    const [start, end] = fromToQuarter.split("-");

    // Extract the year and quarter for both start and end
    const [startYear, startQuarter] = start.split("K").map(Number);
    const [endYear, endQuarter] = end.split("K").map(Number);

    return { startYear, startQuarter, endYear, endQuarter };
  };

  const validateHouseType = (
    houseType: HouseType | string | null
  ): string | boolean => {
    if (houseType) {
      if (!(houseType in houseTypeOptions)) {
        return `House type should be one of the following: ${Object.keys(
          houseTypeOptions
        ).join(", ")}`;
      }
    } else {
      return "House type is required!";
    }

    return true;
  };

  const isNumber = (value: number): boolean => {
    if (!isNaN(value) && typeof value === "number") {
      return true;
    }

    return false;
  };

  const validateQuartersRange = (
    fromToQuarter: string | null
  ): string | boolean => {
    const formatErrorMessage =
      "Valid Quater Range shoulbe be in the format YYYYKQ-YYYYKQ!";

    if (fromToQuarter) {
      if (fromToQuarter.includes("-") && fromToQuarter.includes("K")) {
        const { startYear, startQuarter, endYear, endQuarter } =
          parseQuaterRange(fromToQuarter);

        if (
          isNumber(startYear) &&
          isNumber(endYear) &&
          isNumber(startQuarter) &&
          isNumber(endQuarter)
        ) {
          if (startYear === endYear && startQuarter > endQuarter) {
            return "Invalid end quarter: The end quarter should be greater or equal to start quarter!";
          } else if (1 > startQuarter && startQuarter > 4) {
            return "Invalid start quarter: The start quarter must be between 1 and 4, inclusive!";
          } else if (1 > endQuarter && endQuarter > 4) {
            return "Invalid end quarter: The start quarter must be between 1 and 4, inclusive!";
          } else if (startYear > endYear) {
            return "Invalid end year: The end year should be greater or equal to start year!";
          } else if (startYear < 2009) {
            return "Invalid start year: The start year should be greater or equal to 2009!";
          }
        } else {
          return formatErrorMessage;
        }
      } else {
        return formatErrorMessage;
      }
    } else {
      return "Quarters range is required!";
    }

    return true;
  };

  const onSubmit = (data: SearchParams) => {
    const { quartersRange, houseType } = data;

    window.history.pushState(
      {},
      "",
      `?quartersRange=${quartersRange}&houseType=${houseType}`
    );

    const saveSearch = window.confirm(
      "Do you want to save this search in history?"
    );

    if (saveSearch) {
      const searches: SearchParamsHistory[] = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );

      searches.push({
        quartersRange,
        houseType,
        date: new Date().toISOString(),
      });

      localStorage.setItem("searchHistory", JSON.stringify(searches));
    }

    setSearchParams(data);
  };

  return (
    <Container sx={{ width: "800px" }}>
      <Suspense fallback={<CircularProgress />}>
        {searchParams["quartersRange"] && searchParams["houseType"] ? (
          <PriceChart
            quartersRange={searchParams.quartersRange}
            houseType={searchParams.houseType}
            validateHouseType={validateHouseType}
            validateQuartersRange={validateQuartersRange}
            parseQuaterRange={parseQuaterRange}
          />
        ) : (
          <SearchForm
            onSubmit={onSubmit}
            validateHouseType={validateHouseType}
            validateQuartersRange={validateQuartersRange}
          />
        )}
      </Suspense>
    </Container>
  );
};

export default App;
