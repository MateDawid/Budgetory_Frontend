import { Stack, Typography } from "@mui/material";
import React from "react";


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
