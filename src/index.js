import '@fontsource/roboto/400.css';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './app_infrastructure/components/App';
import axios from "axios";
import { createRoot } from 'react-dom/client';


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
