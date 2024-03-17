import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Bar } from "react-chartjs-2";
import { PriceChartProps } from "./types";
import { houseTypeOptions } from "../houseTypeOptions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, CircularProgress, Container } from "@mui/material";
import { ChartData } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart: React.FC<PriceChartProps> = ({
  quartersRange,
  houseType,
  validateQuartersRange,
  validateHouseType,
  parseQuaterRange,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const isValidQuartersRange = validateQuartersRange(quartersRange);
    const isValidHouseTypeValue = validateHouseType(houseType);

    if (typeof isValidQuartersRange === "string") {
      setErrorMessage(isValidQuartersRange);
    } else if (typeof isValidHouseTypeValue === "string") {
      setErrorMessage(isValidHouseTypeValue);
    } else {
      const houseTypeValue = houseTypeOptions[houseType];
      const { startYear, startQuarter, endYear, endQuarter } =
        parseQuaterRange(quartersRange);
      const quaters = generateQuarterRange(
        startYear,
        startQuarter,
        endYear,
        endQuarter
      );

      const fetchStatistics = async (): Promise<void> => {
        await fetch("https://data.ssb.no/api/v0/no/table/07241", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: [
              {
                code: "Boligtype",
                selection: {
                  filter: "item",
                  values: [houseTypeValue],
                },
              },
              {
                code: "ContentsCode",
                selection: {
                  filter: "item",
                  values: ["KvPris"],
                },
              },
              {
                code: "Tid",
                selection: {
                  filter: "item",
                  values: quaters,
                },
              },
            ],
            response: {
              format: "json-stat2",
            },
          }),
        })
          .then((response) => {
            if (!response.ok) {
              setErrorMessage("Error: The data request failed.");
            }
            return response.json();
          })
          .then((data) => {
            // Extract labels from the Tid dimension
            const labels = Object.keys(data.dimension.Tid.category.label).map(
              (key) => data.dimension.Tid.category.label[key]
            );

            // Assuming 'data.value' holds the values for each quarter in the correct order
            const values = data.value;

            setChartData({
              labels: labels,
              datasets: [
                {
                  label: "Average Price per Square Meter",
                  data: values,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgb(75, 192, 192)",
                  borderWidth: 1,
                },
              ],
            });
          })
          .catch((error) => {
            setErrorMessage(`Error: ${error}`);
          });
      };

      fetchStatistics();
    }
  }, [quartersRange, houseType]);

  const generateQuarterRange = (
    startYear: number,
    startQuarter: number,
    endYear: number,
    endQuarter: number
  ) => {
    const quarters = [];

    // Loop from start year to end year
    for (let year = startYear; year <= endYear; year++) {
      // Determine the start and end quarters for the current year
      const firstQuarter = year === startYear ? startQuarter : 1;
      const lastQuarter = year === endYear ? endQuarter : 4;

      // Loop from the first to the last quarter for the current year
      for (let quarter = firstQuarter; quarter <= lastQuarter; quarter++) {
        quarters.push(`${year}K${quarter}`);
      }
    }

    return quarters;
  };

  return chartData ? (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Bar data={chartData} />
    </Paper>
  ) : errorMessage ? (
    <Typography
      className="myCustomClass"
      variant="body1"
      color="error"
      paragraph
    >
      {errorMessage}
    </Typography>
  ) : (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default PriceChart;
