import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './CartContext'; 
import { AuthProvider } from './AuthContext'; // Import the new security brain
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);