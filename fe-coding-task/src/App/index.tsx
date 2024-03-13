import React, { useState, useEffect } from "react";
import SearchForm from "../SearchForm";
import {
  SearchParams,
  houseTypeOptions,
  HouseType,
} from "../SearchForm/types.ts";
import { SearchParamsHistory } from "./types.ts";
import PriceChart from "../PriceChart";

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    quartersRange: "",
    houseType: "Boliger i alt",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const quartersRange: string | null = queryParams.get("quartersRange");
    const houseType: string | null = queryParams.get("houseType");

    // Check if both parameters exist
    if (quartersRange && houseType && houseType in houseTypeOptions) {
      const validHouseType: HouseType = houseType as HouseType;

      // Update state only if both parameters are present
      setSearchParams({
        quartersRange,
        houseType: validHouseType,
      });
    }
  }, []);

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
    <>
      {!(searchParams["quartersRange"] && searchParams["houseType"]) && (
        <SearchForm onSubmit={onSubmit} />
      )}
      {searchParams["quartersRange"] && searchParams["houseType"] && (
        <PriceChart
          quartersRange={searchParams.quartersRange}
          houseType={searchParams.houseType}
        />
      )}
    </>
  );
};

export default App;
