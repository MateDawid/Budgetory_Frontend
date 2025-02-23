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
                </Route>
                <Route path='login' element={<LoginForm/>}/>
                <Route path='register' element={<RegisterForm/>}/>
            </Routes>
            </ContextBudgetProvider>
        </AlertProvider>
    );
}

export default App;