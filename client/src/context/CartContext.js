import React, { createContext, useState } from "react";

// Создаем контекст
export const CartContext = createContext();

// Провайдер контекста корзины
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Функция для добавления товара в корзину
    const addToCart = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    // Функция для удаления товара из корзины
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
