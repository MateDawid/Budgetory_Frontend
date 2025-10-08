import { Stack, Typography } from "@mui/material";
import React from "react";

/**
 * Function calculating font color basing on current and maximum value of specified param.
 * @param {string} currentValue - Actual value of paramether.
 * @param {string} maxValue - Maximum value of paramether.
 * @returns {string} Calculated color value.
 */
export const getFontColor = (currentValue, maxValue) => {
  const current = Number(currentValue);
  const max = Number(maxValue);

  if (max <= 0 && current <= 0) {
    return "rgb(0 0 0 / 87%)";
  } else if (current > max) {
    return "#BD0000";
  }
  return "#008000";
};

/**
 * Function preparing "Category" column value to be displayed in Table.
 * @param {object} row - Object containind particular row data.
 * @returns {React.ReactElement} Prepared TableCell content for "Category" column.
 */
export const getCategoryCellContent = (row) => {
  return (
    <Stack
      gap={1}
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        {row.category_priority}
      </Typography>
      <Typography variant="body2">{row.category_display}</Typography>
    </Stack>
  );
};
