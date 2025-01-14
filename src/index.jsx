import React from 'react';
import '@fontsource/roboto/400.css';
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './app_infrastructure/components/App';
import axios from "axios";
import { createRoot } from 'react-dom/client';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
