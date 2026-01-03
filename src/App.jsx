import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import BasePage from './app_infrastructure/pages/BasePage';
import LoginForm from './app_users/pages/LoginForm';
import RegisterForm from './app_users/pages/RegisterForm';
import WalletList from './wallets/pages/WalletList';
import { AlertProvider } from './app_infrastructure/store/AlertContext';
import { ContextWalletProvider } from './app_infrastructure/store/WalletContext';
import TransferCategoryList from './categories/pages/TransferCategoryList';
import EntityList from './entities/pages/EntityList';
import DepositList from './entities/pages/DepositList';
import IncomeList from './transfers/pages/IncomeList';
import ExpenseList from './transfers/pages/ExpenseList';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import WalletDetail from './wallets/pages/WalletDetail';
import DepositDetail from './entities/pages/DepositDetail';
import EntityDetail from './entities/pages/EntityDetail';
import TransferCategoryDetail from './categories/pages/TransferCategoryDetail';
import ExpensePredictionsPage from './predictions/pages/ExpensePredictionsPage';
import LandingPage from './app_infrastructure/pages/LandingPage';
import { DepositChoicesProvider } from './app_infrastructure/store/DepositChoicesContext';
import { EntityChoicesProvider } from './app_infrastructure/store/EntityChoicesContext';
import { PeriodChoicesProvider } from './app_infrastructure/store/PeriodChoicesContext';
import PeriodList from './periods/pages/PeriodList';
import PeriodDetail from './periods/pages/PeriodDetail';

/**
 * App component handles routing of application.
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <ContextWalletProvider>
          <Routes>
            <Route path="/" element={<BasePage />}>
              <Route
                index
                element={
                  <DepositChoicesProvider>
                    <EntityChoicesProvider>
                      <PeriodChoicesProvider>
                        <LandingPage />
                      </PeriodChoicesProvider>
                    </EntityChoicesProvider>
                  </DepositChoicesProvider>
                }
              />
              <Route path="wallets">
                <Route index element={<WalletList />} />
                <Route
                  path=":id"
                  element={
                    <DepositChoicesProvider>
                      <PeriodChoicesProvider>
                        <WalletDetail />
                      </PeriodChoicesProvider>
                    </DepositChoicesProvider>
                  }
                />
              </Route>
              <Route path="periods">
                <Route index element={<PeriodList />} />
                <Route
                  path=":id"
                  element={
                    <DepositChoicesProvider>
                      <PeriodChoicesProvider>
                        <PeriodDetail />
                      </PeriodChoicesProvider>
                    </DepositChoicesProvider>
                  }
                />
              </Route>
              <Route path="deposits">
                <Route index element={<DepositList />} />
                <Route
                  path=":id"
                  element={
                    <DepositChoicesProvider>
                      <EntityChoicesProvider>
                        <DepositDetail />
                      </EntityChoicesProvider>
                    </DepositChoicesProvider>
                  }
                />
              </Route>
              <Route path="entities">
                <Route index element={<EntityList />} />
                <Route
                  path=":id"
                  element={
                    <DepositChoicesProvider>
                      <EntityChoicesProvider>
                        <EntityDetail />
                      </EntityChoicesProvider>
                    </DepositChoicesProvider>
                  }
                />
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
        </ContextWalletProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
