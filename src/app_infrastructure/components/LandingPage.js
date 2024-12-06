import React from 'react';
import {isLoggedIn} from "../../app_users/services/LoginService";
import {Navigate} from "react-router-dom";

/**
 * LandingPage component displays home page of application.
 */
function LandingPage() {
    if (!isLoggedIn()) {
        return <Navigate to='/login'/>;
    }
    return (<><h1>LANDING PAGE</h1></>);
}

export default LandingPage;