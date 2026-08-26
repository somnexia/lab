import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from './context/AuthContext';
/**
 * Пункты 8–9: единый http-клиент (вместо setupApiClient).
 * Side-effect import: interceptors на axios.create() из config/http.js.
 * Проверка миграции: npm run check:api + smoke в комментарии http.js.
 */
import './config/http';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);

reportWebVitals();
