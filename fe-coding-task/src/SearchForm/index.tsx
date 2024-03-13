import React from "react";
import { useForm } from "react-hook-form";
import { SearchParams, houseTypeOptions } from "./types";
import { TextField, Select, MenuItem, Button } from "@mui/material";

interface Props {
  onSubmit: (data: SearchParams) => void;
}

const SearchForm: React.FC<Props> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchParams>();

  const validateQuartersRange = (fromToQuarter: string): string | undefined => {
    // Split the range into start and end
    const [start, end] = fromToQuarter.split("-");

    // Extract the year and quarter for both start and end
    const [startYear, startQuarter] = start.split("K").map(Number);
    const [endYear, endQuarter] = end.split("K").map(Number);

    if (startYear === endYear && startQuarter > endQuarter) {
      return "The end quarter must be after the start quarter";
    } else if (startYear > endYear) {
      return "The end year must be after the start year";
    }
  };

  return (
    <>
      <h1>Search Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="quartersRange">
            Quarters Range (e.g., 2016K1-2021K4):{" "}
          </label>
          <TextField
            label="Quarters Range"
            variant="outlined"
            {...register("quartersRange", {
              required: "Quarters range is required",
              validate: validateQuartersRange,
              pattern: {
                value:
                  /^(2009K[1-4]|20[1-9]\dK[1-4])-((2009|20[1-9]\d)K[1-4])$/,
                message:
                  "Enter a valid range from 2009K1 onwards in the format YYYYKQ-YYYYKQ",
              },
            })}
            error={!!errors.quartersRange}
          />
          {errors.quartersRange && <p>{errors.quartersRange.message}</p>}
        </div>
        <div>
          <label htmlFor="houseType">House Type: </label>
          <Select
            {...register("houseType", { required: "House type is required" })}
            error={!!errors.houseType}
            defaultValue=""
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a house type
            </MenuItem>
            {Object.entries(houseTypeOptions).map(([label, value]) => (
              <MenuItem
                key={value}
                value={label}
                {...register("houseType", {
                  required: "House type is required",
                })}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
          {errors.houseType && <p>{errors.houseType.message}</p>}
        </div>
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>
    </>
  );
};

export default SearchForm;
