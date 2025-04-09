import React from 'react';
import {Route, Routes} from 'react-router-dom';

import './App.css';
import BasePage from "./app_infrastructure/pages/BasePage";
import LandingPage from "./app_infrastructure/pages/LandingPage";
import LoginForm from "./app_users/pages/LoginForm";
import RegisterForm from "./app_users/pages/RegisterForm";
import BudgetList from "./budgets/pages/BudgetList";
import {AlertProvider} from "./app_infrastructure/components/AlertContext";
import BudgetingPeriodList from "./budgets/pages/BudgetingPeriodList";
import {ContextBudgetProvider} from "./app_infrastructure/components/BudgetContext";
import TransferCategoryList from "./categories/pages/TransferCategoryList";
import EntityList from "./entities/pages/EntityList";
import DepositList from "./entities/pages/DepositList";
import ExpensePredictionList from "./predictions/pages/ExpensePredictionList";
import IncomeList from "./transfers/pages/IncomeList";
import ExpenseList from "./transfers/pages/ExpenseList";
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme";

/**
 * App component handles routing of application.
 */
function App() {
    return (
        <ThemeProvider theme={theme}>
        <AlertProvider>
            <ContextBudgetProvider>
            <Routes>
                <Route path='/' element={<BasePage/>}>
                    <Route index element={<LandingPage/>}/>
                    <Route path='budgets' element={<BudgetList/>}/>
                    <Route path='periods' element={<BudgetingPeriodList/>}/>
                    <Route path='transfer_categories' element={<TransferCategoryList/>}/>
                    <Route path='deposits' element={<DepositList/>}/>
                    <Route path='entities' element={<EntityList/>}/>
                    <Route path='expense_predictions' element={<ExpensePredictionList/>}/>
                    <Route path='incomes' element={<IncomeList/>}/>
                    <Route path='expenses' element={<ExpenseList/>}/>
                </Route>
                <Route path='login' element={<LoginForm/>}/>
                <Route path='register' element={<RegisterForm/>}/>
            </Routes>
            </ContextBudgetProvider>
        </AlertProvider>
        </ThemeProvider>
    );
}

export default App;