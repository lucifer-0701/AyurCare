import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1E3A2F',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(30, 58, 47, 0.12)',
              fontFamily: 'Lato, sans-serif',
              fontSize: '14px',
              padding: '12px 16px',
              border: '1px solid rgba(74, 124, 89, 0.15)',
            },
            success: {
              iconTheme: { primary: '#4A7C59', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
