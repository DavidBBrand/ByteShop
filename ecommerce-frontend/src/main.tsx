import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
