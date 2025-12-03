import {
  Typography,
  Box,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import StyledModal from '../../../app_infrastructure/components/StyledModal';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';

export default function PredictionInspectModal({
  periodId,
  categoryId,
  inspectOpen,
  setInspectOpen,
}) {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
  const [expenses, setExpenses] = useState([]);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expenses/`;

  /**
   * Fetches select options for ExpensePrediction select fields from API.
   */
  useEffect(() => {
    async function getPeriodCategoryExpenses() {
      try {
        const filterModel = {
          period: periodId,
          category: categoryId ? categoryId : -1,
          ordering: 'date',
        };
        const response = await getApiObjectsList(apiUrl, {}, {}, filterModel);
        setExpenses(response);
      } catch {
        setExpenses([]);
      }
    }

    if (!contextBudgetId || !inspectOpen) {
      return;
    }
    getPeriodCategoryExpenses();
  }, [contextBudgetId, inspectOpen]);

  return (
    <StyledModal open={inspectOpen} onClose={() => setInspectOpen(false)}>
      <Box bgcolor="#F1F1F1" p={3} borderRadius={5}>
        <Typography variant="h6" component="h2" textAlign="center">
          Period Expenses in Category
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
          {expenses.length > 0 ? (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer
                sx={{
                  maxHeight: '70vh',
                }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 'bold', minWidth: 100 }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 'bold', minWidth: 100 }}
                      >
                        Value
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                        Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell align="center">{row.date}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          {row.value}&nbsp;{contextBudgetCurrency}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              textAlign: 'justify',
                              width: '100%',
                            }}
                          >
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              textAlign: 'justify',
                              width: '100%',
                            }}
                          >
                            {row.description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Typography color="primary" fontWeight="bold">
              No Expenses found.
            </Typography>
          )}
        </Box>
      </Box>
    </StyledModal>
  );
}
