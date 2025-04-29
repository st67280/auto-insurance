import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { InsuranceProvider } from './contexts/InsuranceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <InsuranceProvider>
                    <App />
                    <ToastContainer position="top-right" autoClose={3000} />
                </InsuranceProvider>
            </AuthProvider>
        </Router>
    </React.StrictMode>
);