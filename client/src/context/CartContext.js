/**
 * CartContext — состояние корзины для всего UI (Header, CartDrawer, таблицы лотов).
 *
 * Два режима:
 *   - гость: массив в localStorage (ключа "cart"), без API;
 *   - вошедший: строки в таблице carts на сервере.
 *
 * Владелец на сервере — JWT (req.user.id), не поле user_id из React.
 * Клиент шлёт свой id только там, где URL его требует
 * (GET /carts/:user_id, DELETE /clear/:user_id) и обязан совпасть с токеном.
 * В POST/PUT/DELETE item user_id в body не передаём: сервер подставит или отбросит.
 *
 * HTTP: config/http.js (Bearer) + API.carts.
 *
 * Network (свой пользователь, id=7):
 *   GET    /api/carts/7
 *   POST   /api/carts              { item_id, quantity, … }  — без user_id
 *   PUT    /api/carts/item/42      { quantity }
 *   DELETE /api/carts/item/42
 *   DELETE /api/carts/clear/7
 *
 * Проверить:
 *   войти → Add to cart → Drawer → изменить количество / удалить / очистить → F5.
 */
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { API } from "../config/api";
import { http } from "../config/http";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

/**
 * Строка Sequelize иногда приходит как { dataValues }.
 * Для React нужен плоский объект (id, item_id, quantity, …).
 */
function normalizeCartRow(row) {
    if (!row) return null;
    if (row.dataValues) return { ...row.dataValues };
    return { ...row };
}

/**
 * Id лота инвентаря (не id строки корзины).
 * Кнопка «Add to cart» передаёт объект Inventory, у которого id = лот.
 */
function inventoryIdFromItem(item) {
    return item?.id ?? item?.item_id ?? item?.reference_id;
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    /**
     * Загрузить корзину текущего пользователя.
     * userId в URL — тот же, что в JWT; чужой id сервер ответит 403.
     */
    const reloadCart = useCallback(async (userId) => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await http.get(`${API.carts}/${userId}`);
            setCart(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to reload cart:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Ответ мутации: массив, одна строка, или { message } после delete/clear.
     * Неполный ответ — догружаем GET своей корзины.
     */
    const applyCartMutationResponse = useCallback(
        async (data, userId, options = {}) => {
            const { removedCartLineId, cleared } = options;

            if (Array.isArray(data)) {
                setCart(data);
                return;
            }

            if (cleared) {
                setCart([]);
                return;
            }

            if (removedCartLineId != null) {
                setCart((prev) => prev.filter((item) => item.id !== removedCartLineId));
                if (userId) {
                    await reloadCart(userId);
                }
                return;
            }

            const row = normalizeCartRow(data);
            if (row?.id != null && row.item_id != null) {
                setCart((prev) => {
                    const byLineId = prev.findIndex((i) => i.id === row.id);
                    if (byLineId !== -1) {
                        const next = [...prev];
                        next[byLineId] = row;
                        return next;
                    }
                    const byItemId = prev.findIndex((i) => i.item_id === row.item_id);
                    if (byItemId !== -1) {
                        const next = [...prev];
                        next[byItemId] = row;
                        return next;
                    }
                    return [...prev, row];
                });
                return;
            }

            if (userId) {
                await reloadCart(userId);
            }
        },
        [reloadCart]
    );

    /** Вход — серверная корзина; выход — localStorage гостя. */
    useEffect(() => {
        if (user?.id) {
            reloadCart(user.id);
        } else {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch {
                    localStorage.removeItem("cart");
                    setCart([]);
                }
            } else {
                setCart([]);
            }
        }
    }, [user, reloadCart]);

    /** Гостевую корзину пишем на диск при каждом изменении. */
    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, user]);

    /**
     * Добавить лот. Сервер сам ставит user_id = req.user.id.
     */
    const addToCart = async (newItem) => {
        const inventoryId = inventoryIdFromItem(newItem);
        if (inventoryId == null) {
            console.error("addToCart: missing inventory id", newItem);
            return;
        }

        if (user) {
            try {
                const itemToAdd = {
                    item_id: inventoryId,
                    item_name: newItem.item_name,
                    quantity: newItem.quantity || 1,
                    substance_amount: newItem.substance_amount ?? null,
                    unit_measure: newItem.unit_measure ?? null,
                    supplier: newItem.supplier ?? null,
                    status: newItem.status ?? null,
                };
                const response = await http.post(API.carts, itemToAdd);
                await applyCartMutationResponse(response.data, user.id);
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        } else {
            setCart((prevCart) => {
                const existingIndex = prevCart.findIndex(
                    (item) => item.item_id === inventoryId || item.id === inventoryId
                );
                let updatedCart;
                if (existingIndex !== -1) {
                    updatedCart = [...prevCart];
                    updatedCart[existingIndex] = {
                        ...updatedCart[existingIndex],
                        quantity: (updatedCart[existingIndex].quantity || 0) + (newItem.quantity || 1),
                    };
                } else {
                    updatedCart = [
                        ...prevCart,
                        {
                            ...newItem,
                            id: inventoryId,
                            item_id: inventoryId,
                            quantity: newItem.quantity || 1,
                        },
                    ];
                }
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    /**
     * Удалить строку по Cart.id. Владелец проверяется на сервере по JWT.
     */
    const removeFromCart = async (cartLineId) => {
        if (user) {
            try {
                const response = await http.delete(`${API.carts}/item/${cartLineId}`);
                await applyCartMutationResponse(response.data, user.id, {
                    removedCartLineId: cartLineId,
                });
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        } else {
            setCart((prevCart) => {
                const updatedCart = prevCart.filter((item) => item.id !== cartLineId);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    /**
     * Сменить quantity своей строки. user_id в body не шлём (сервер его отбросит).
     */
    const updateCartQuantity = async (cartLineId, newQuantity) => {
        if (user) {
            try {
                const response = await http.put(`${API.carts}/item/${cartLineId}`, {
                    quantity: newQuantity,
                });
                await applyCartMutationResponse(response.data, user.id);
            } catch (error) {
                console.error("Error updating cart quantity:", error);
            }
        } else {
            setCart((prevCart) => {
                const updatedCart = prevCart.map((item) =>
                    item.id === cartLineId ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            });
        }
    };

    /**
     * Очистить свою корзину. :user_id в URL = текущий user.id (должен совпасть с JWT).
     */
    const clearCart = async () => {
        if (user) {
            try {
                const response = await http.delete(`${API.carts}/clear/${user.id}`);
                await applyCartMutationResponse(response.data, user.id, { cleared: true });
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        } else {
            setCart([]);
            localStorage.removeItem("cart");
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, loading, reloadCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
