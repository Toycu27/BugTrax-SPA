import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css'
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
reportWebVitals();