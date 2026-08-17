import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { API } from "../config/api";
import { http } from "../config/http";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

/** Sequelize / API row → plain object for React state */
function normalizeCartRow(row) {
    if (!row) return null;
    if (row.dataValues) return { ...row.dataValues };
    return { ...row };
}

/** Inventory row id (add-to-cart passes inventory, not cart line) */
function inventoryIdFromItem(item) {
    return item?.id ?? item?.item_id ?? item?.reference_id;
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

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
     * API may return a full cart array, a single cart line, or { message }.
     * Prefer array; otherwise merge one row or reload from GET.
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

    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, user]);

    const addToCart = async (newItem) => {
        const inventoryId = inventoryIdFromItem(newItem);
        if (inventoryId == null) {
            console.error("addToCart: missing inventory id", newItem);
            return;
        }

        if (user) {
            try {
                const itemToAdd = {
                    user_id: user.id,
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

    const removeFromCart = async (cartLineId) => {
        if (user) {
            try {
                const response = await http.delete(`${API.carts}/item/${cartLineId}`, {
                    data: { user_id: user.id },
                });
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

    const updateCartQuantity = async (cartLineId, newQuantity) => {
        if (user) {
            try {
                const response = await http.put(`${API.carts}/item/${cartLineId}`, {
                    user_id: user.id,
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
