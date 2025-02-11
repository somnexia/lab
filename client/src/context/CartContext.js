import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    // Функция для загрузки корзины с сервера
    const loadCart = async () => {
        if (user) {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/api/carts/${user.id}`);
                setCart(Array.isArray(response.data) ? response.data : []);
                console.log("Ответ сервера при загрузке корзины:", response.data);
                
            } catch (error) {
                console.error('Ошибка при загрузке корзины:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (user) {
            loadCart();
        } else {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, user]);

    // Функция для добавления товара в корзину
    const addToCart = async (newItem) => {
        console.log('newItem:', newItem);

        if (user) {
            try {
                const itemToAdd = {
                    user_id: user.id,
                    item_id: newItem.id,
                    item_name: newItem.item_name,
                    quantity: newItem.quantity || 1,
                    substance_amount: newItem.substance_amount,
                    unit_measure: newItem.unit_measure,
                    supplier: newItem.supplier,
                    status: newItem.status,
                };
                console.log('Данные, отправляемые на сервер для добавления:', itemToAdd);
                const response = await axios.post(
                    `http://localhost:3000/api/carts`,
                    itemToAdd
                );
                console.log('Ответ сервера после добавления:', response.data);
                if (Array.isArray(response.data)) {
                    setCart(response.data);
                } else {
                    console.error('Ожидался массив после добавления, но получен:', typeof response.data);
                }
            } catch (error) {
                console.error('Ошибка при добавлении товара в корзину:', error);
            }
        } else {
            setCart((prevCart) => {
                const existingItemIndex = prevCart.findIndex((item) => item.id === newItem.id);
                let updatedCart;
                if (existingItemIndex !== -1) {
                    updatedCart = [...prevCart];
                    updatedCart[existingItemIndex].quantity += newItem.quantity || 1;
                } else {
                    updatedCart = [...prevCart, { ...newItem, quantity: newItem.quantity || 1 }];
                }
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    // Функция для удаления товара из корзины
    const removeFromCart = async (id) => {
        if (user) {
            try {
                console.log('ID товара для удаления:', id);
                const response = await axios.delete(
                    `http://localhost:3000/api/carts/item/${id}`,
                    { data: { user_id: user.id } }
                );
                console.log('Ответ сервера после удаления:', response.data);
                if (Array.isArray(response.data)) {
                    setCart(response.data);
                } else {
                    console.error('Ожидался массив после удаления, но получен:', typeof response.data);
                }
            } catch (error) {
                console.error('Ошибка при удалении товара из корзины:', error);
            }
        } else {
            setCart((prevCart) => {
                const updatedCart = prevCart.filter((item) => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    // Функция для обновления количества товара в корзине
    const updateCartQuantity = async (itemId, newQuantity) => {
        if (user) {
            try {
                const updateData = { user_id: user.id, quantity: newQuantity };
                console.log('Данные, отправляемые на сервер для обновления:', updateData);
                const response = await axios.put(
                    `http://localhost:3000/api/carts/item/${itemId}`,
                    updateData
                );
                console.log('Ответ сервера после обновления:', response.data);
                if (Array.isArray(response.data)) {
                    setCart(response.data);
                } else {
                    console.error('Ожидался массив после обновления, но получен:', typeof response.data);
                }
            } catch (error) {
                console.error('Ошибка при обновлении количества товара в корзине:', error);
            }
        } else {
            setCart((prevCart) => {
                const updatedCart = prevCart.map((item) =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    // Очистка корзины
    const clearCart = async () => {
        if (user) {
            try {
                console.log('Очистка корзины для пользователя с ID:', user.id);
                const response = await axios.delete(`http://localhost:3000/api/carts/clear/${user.id}`);
                console.log('Ответ сервера после очистки:', response.data);
                if (Array.isArray(response.data)) {
                    setCart(response.data);
                } else {
                    console.error('Ожидался массив после очистки, но получен:', typeof response.data);
                }
            } catch (error) {
                console.error('Ошибка при очистке корзины:', error);
            }
        } else {
            setCart([]);
            localStorage.removeItem('cart');
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
