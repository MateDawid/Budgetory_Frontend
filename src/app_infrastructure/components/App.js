import React from 'react';
import {Route, Routes} from 'react-router-dom';

import '../styles/App.css';
import Layout from "./Layout";
import LandingPage from "./LandingPage";
import LoginForm from "../../app_users/components/LoginForm";
import RegisterForm from "../../app_users/components/RegisterForm";

/**
 * App component handles routing of application.
 */
function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<LandingPage/>}/>
            </Route>
            <Route path='login' element={<LoginForm/>}/>
            <Route path='register' element={<RegisterForm/>}/>
        </Routes>
    );
}


export default App;