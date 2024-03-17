import React from "react";
import { useForm } from "react-hook-form";
import { SearchFormProps, SearchParams } from "./types";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Grid,
  InputLabel,
} from "@mui/material";
import { houseTypeOptions } from "../houseTypeOptions";

const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  validateHouseType,
  validateQuartersRange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchParams>();
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Search Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={6} container alignItems="center">
            <InputLabel htmlFor="quartersRange">Quarters Range: </InputLabel>
          </Grid>
          <Grid item xs={6} container alignItems="center">
            <TextField
              fullWidth
              id="quartersRange"
              label="Quarters Range"
              variant="outlined"
              {...register("quartersRange", {
                validate: validateQuartersRange,
              })}
              error={!!errors.quartersRange}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="error">
              {errors.quartersRange && errors.quartersRange.message}
            </Typography>
          </Grid>

          <Grid item xs={6} container alignItems="center">
            <InputLabel htmlFor="houseType">House Type: </InputLabel>
          </Grid>
          <Grid item xs={6} container alignItems="center">
            <Select
              fullWidth
              id="houseType"
              {...register("houseType", {
                validate: validateHouseType,
              })}
              error={!!errors.houseType}
              defaultValue=""
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a house type
              </MenuItem>
              {Object.entries(houseTypeOptions).map(([label, value]) => (
                <MenuItem key={value} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            {errors.houseType && (
              <Typography variant="body1" color="error">
                {errors.houseType?.message}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box mt={5.625}>
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </form>
    </>
  );
};

export default SearchForm;
