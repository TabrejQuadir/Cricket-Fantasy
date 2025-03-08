import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { PWAProvider } from './context/PWAContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PWAProvider>
            <AuthProvider>  {/* ✅ Wrap your entire app */}
                <App />
            </AuthProvider>
        </PWAProvider>
    </React.StrictMode>
);
