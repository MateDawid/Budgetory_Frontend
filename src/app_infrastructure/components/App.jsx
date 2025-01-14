import React from 'react';
import {Route, Routes} from 'react-router-dom';

import '../styles/App.css';
import BasePage from "../pages/BasePage";
import LandingPage from "../pages/LandingPage";
import LoginForm from "../../app_users/pages/LoginForm";
import RegisterForm from "../../app_users/pages/RegisterForm";
import BudgetList from "../../budgets/pages/BudgetList";
import BudgetDetail from "../../budgets/pages/BudgetDetail";
import BudgetAdd from "../../budgets/pages/BudgetAdd";
import {AlertProvider} from "./AlertContext";

/**
 * App component handles routing of application.
 */
function App() {
    return (
        <AlertProvider>
            <Routes>
                <Route path='/' element={<BasePage/>}>
                    <Route index element={<LandingPage/>}/>
                    <Route path='budgets'>
                        <Route index element={<BudgetList/>}/>
                        <Route path='add' element={<BudgetAdd/>}/>
                        <Route path=':budgetId' element={<BudgetDetail/>}/>
                    </Route>
                </Route>
                <Route path='login' element={<LoginForm/>}/>
                <Route path='register' element={<RegisterForm/>}/>
            </Routes>
        </AlertProvider>
    );
}

export default App;