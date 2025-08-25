import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

/**
 * LandingPage component displays home page of application.
 */
function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/budgets');
    }, []);


    return (<><h1>LANDING PAGE</h1></>);
}

export default LandingPage;