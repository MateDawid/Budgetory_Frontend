import React from 'react';
import {Route, Routes} from 'react-router-dom';

import '../styles/App.css';
import BasePage from "../pages/BasePage";
import LandingPage from "../pages/LandingPage";
import LoginForm from "../../app_users/pages/LoginForm";
import RegisterForm from "../../app_users/pages/RegisterForm";
import BudgetList from "../../budgets/pages/BudgetList";
import {AlertProvider} from "./AlertContext";
import BudgetingPeriodList from "../../budgets/pages/BudgetingPeriodList";
import {ContextBudgetProvider} from "./BudgetContext";
import TransferCategoryList from "../../categories/pages/TransferCategoryList";
import EntityList from "../../entities/pages/EntityList";
import DepositList from "../../entities/pages/DepositList";

/**
 * App component handles routing of application.
 */
function App() {
    return (
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
                </Route>
                <Route path='login' element={<LoginForm/>}/>
                <Route path='register' element={<RegisterForm/>}/>
            </Routes>
            </ContextBudgetProvider>
        </AlertProvider>
    );
}

export default App;