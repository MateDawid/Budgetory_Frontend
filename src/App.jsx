import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import BasePage from './app_infrastructure/pages/BasePage';
import LandingPage from './app_infrastructure/pages/LandingPage';
import LoginForm from './app_users/pages/LoginForm';
import RegisterForm from './app_users/pages/RegisterForm';
import BudgetList from './budgets/pages/BudgetList';
import { AlertProvider } from './app_infrastructure/store/AlertContext';
import BudgetingPeriodList from './budgets/pages/BudgetingPeriodList';
import { ContextBudgetProvider } from './app_infrastructure/store/BudgetContext';
import TransferCategoryList from './categories/pages/TransferCategoryList';
import EntityList from './entities/pages/EntityList';
import DepositList from './entities/pages/DepositList';
import IncomeList from './transfers/pages/IncomeList';
import ExpenseList from './transfers/pages/ExpenseList';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import BudgetDetail from './budgets/pages/BudgetDetail';
import BudgetingPeriodDetail from './budgets/pages/BudgetingPeriodDetail';
import DepositDetail from './entities/pages/DepositDetail';
import EntityDetail from './entities/pages/EntityDetail';
import TransferCategoryDetail from './categories/pages/TransferCategoryDetail';
import ExpensePredictionsPage from './predictions/pages/ExpensePredictionsPage';

/**
 * App component handles routing of application.
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <ContextBudgetProvider>
          <Routes>
            <Route path="/" element={<BasePage />}>
              <Route index element={<LandingPage />} />
              <Route path="budgets">
                <Route index element={<BudgetList />} />
                <Route path=":id" element={<BudgetDetail />} />
              </Route>
              <Route path="periods">
                <Route index element={<BudgetingPeriodList />} />
                <Route path=":id" element={<BudgetingPeriodDetail />} />
              </Route>
              <Route path="deposits">
                <Route index element={<DepositList />} />
                <Route path=":id" element={<DepositDetail />} />
              </Route>
              <Route path="entities">
                <Route index element={<EntityList />} />
                <Route path=":id" element={<EntityDetail />} />
              </Route>
              <Route path="categories">
                <Route index element={<TransferCategoryList />} />
                <Route path=":id" element={<TransferCategoryDetail />} />
              </Route>
              <Route path="incomes" element={<IncomeList />} />
              <Route path="expenses" element={<ExpenseList />} />
              <Route path="predictions" element={<ExpensePredictionsPage />} />
            </Route>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Routes>
        </ContextBudgetProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
