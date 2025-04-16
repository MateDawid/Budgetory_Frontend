import React from 'react';
import '@fontsource/roboto/400.css';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import axios from "axios";
import { createRoot } from 'react-dom/client';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
