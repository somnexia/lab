import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from './context/AuthContext';
import { setupApiClient } from './config/setupApiClient';

setupApiClient();

//


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>


);

reportWebVitals();
