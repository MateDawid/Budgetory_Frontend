import React from 'react';
import {Route, Routes} from 'react-router-dom';

import '../styles/App.css';
import BasePage from "../pages/BasePage";
import LandingPage from "../pages/LandingPage";
import LoginForm from "../../app_users/pages/LoginForm";
import RegisterForm from "../../app_users/pages/RegisterForm";
import BudgetList from "../../budgets/pages/BudgetList";

/**
 * App component handles routing of application.
 */
function App() {
    return (
        <Routes>
            <Route path='/' element={<BasePage/>}>
                <Route index element={<LandingPage/>}/>
                <Route path='budgets' element={<BudgetList/>}/>
            </Route>
            <Route path='login' element={<LoginForm/>}/>
            <Route path='register' element={<RegisterForm/>}/>
        </Routes>
    );
}

export default App;