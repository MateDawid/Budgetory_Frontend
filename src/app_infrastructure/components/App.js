import React from 'react';
import {Route, Routes} from 'react-router-dom';

import '../styles/App.css';
import Layout from "./Layout";

function App() {
    return (
        <Routes>
            <Route
                path='/'
                element={
                    <Layout/>
                }
            >
            </Route>
        </Routes>
    );
}


export default App;