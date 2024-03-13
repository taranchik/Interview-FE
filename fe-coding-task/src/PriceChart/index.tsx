import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { PriceChartProps } from "./types";
import { houseTypeOptions } from "../SearchForm/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, CircularProgress } from "@mui/material";
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
}) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    const fetchStatistics = async (): Promise<void> => {
      const houseTypeValue = houseTypeOptions[houseType];
      const quaters = generateQuarterRange(quartersRange);

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
            throw new Error(`HTTP error! status: ${response.status}`);
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
          console.error("Fetch error:", error);
        });
    };

    fetchStatistics();
  }, [quartersRange, houseType]);

  const generateQuarterRange = (fromToQuarter: string) => {
    // Split the range into start and end
    const [start, end] = fromToQuarter.split("-");

    // Extract the year and quarter for both start and end
    const [startYear, startQuarter] = start.split("K").map(Number);
    const [endYear, endQuarter] = end.split("K").map(Number);

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
  ) : (
    <CircularProgress />
  );
};

export default PriceChart;
