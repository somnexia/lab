import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaTrashAlt, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import InventoryDetailsModal from "./InventoryDetailsModal";

const MAX_QUANTITY = 20;

function statusBadgeClass(status) {
    const s = (status || "").toString().toLowerCase();
    if (s === "available") return "lab-cart__badge lab-cart__badge--available";
    if (s === "in use") return "lab-cart__badge lab-cart__badge--in-use";
    if (s === "reserved") return "lab-cart__badge lab-cart__badge--reserved";
    if (s === "unavailable" || s === "expired") return "lab-cart__badge lab-cart__badge--unavailable";
    return "lab-cart__badge lab-cart__badge--neutral";
}

function cartItemToInventory(item) {
    return {
        id: item.item_id,
        item_name: item.item_name,
        item_type: item.item_type,
        substance_amount: item.substance_amount,
        unit_measure: item.unit_measure,
        supplier: item.supplier,
        status: item.status,
        location: item.location,
    };
}

class Cart extends Component {
    static contextType = CartContext;

    state = {
        isModalOpen: false,
        selectedItem: null,
        confirmClear: false,
        feedback: null,
    };

    openModal = (item) => {
        this.setState({
            isModalOpen: true,
            selectedItem: cartItemToInventory(item),
        });
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            selectedItem: null,
        });
    };

    showFeedback = (message, isError = false) => {
        this.setState({ feedback: { message, isError } });
        window.clearTimeout(this._feedbackTimer);
        this._feedbackTimer = window.setTimeout(() => {
            this.setState({ feedback: null });
        }, 4000);
    };

    handleQuantityChange = (item, delta) => {
        const { updateCartQuantity } = this.context;
        const next = Math.min(MAX_QUANTITY, Math.max(1, (item.quantity || 1) + delta));
        if (next !== item.quantity) {
            updateCartQuantity(item.id, next);
        }
    };

    handleRemove = (item) => {
        const { removeFromCart } = this.context;
        removeFromCart(item.id);
        this.showFeedback(`Removed "${item.item_name || "item"}" from cart.`);
        if (this.state.selectedItem?.id === item.item_id) {
            this.closeModal();
        }
    };

    requestClearCart = () => {
        this.setState({ confirmClear: true });
    };

    cancelClearCart = () => {
        this.setState({ confirmClear: false });
    };

    confirmClearCart = () => {
        const { clearCart } = this.context;
        clearCart();
        this.setState({ confirmClear: false });
        this.showFeedback("Cart cleared.");
    };

    handleCheckout = (user) => {
        const { cart } = this.context;
        if (!user) {
            this.showFeedback("Sign in to proceed with checkout.", true);
            return;
        }
        if (cart.length === 0) {
            this.showFeedback("Your cart is empty.", true);
            return;
        }
        this.showFeedback("Checkout is not configured yet — your cart is saved on the server.");
    };

    componentWillUnmount() {
        window.clearTimeout(this._feedbackTimer);
    }

    renderMainColumn() {
        const { cart, loading } = this.context;
        const { confirmClear } = this.state;

        if (loading) {
            return <p className="lab-cart__loading">Loading your cart…</p>;
        }

        if (cart.length === 0) {
            return (
                <>
                    <p className="lab-cart__empty">
                        Your collection cart is empty. Browse inventory and add items you need for research or orders.
                    </p>
                    <div className="lab-cart__empty-actions">
                        <Link to="/inventory/overview" className="lab-cart__btn-primary">
                            Browse inventory
                        </Link>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="lab-cart__table-scroll">
                    <table className="lab-cart__table">
                        <thead>
                            <tr>
                                <th className="lab-cart__th" scope="col">Item</th>
                                <th className="lab-cart__th" scope="col">Amount</th>
                                <th className="lab-cart__th" scope="col">Supplier</th>
                                <th className="lab-cart__th" scope="col">Status</th>
                                <th className="lab-cart__th" scope="col">Qty</th>
                                <th className="lab-cart__th" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.id} className="lab-cart__tr">
                                    <td className="lab-cart__td">
                                        <span className="lab-cart__item-name" title={item.item_name}>
                                            {item.item_name}
                                        </span>
                                        <span className="lab-cart__item-meta">#{item.item_id}</span>
                                    </td>
                                    <td className="lab-cart__td">
                                        {item.substance_amount != null && item.substance_amount !== ""
                                            ? `${item.substance_amount} ${item.unit_measure || ""}`.trim()
                                            : "—"}
                                    </td>
                                    <td className="lab-cart__td">{item.supplier || "—"}</td>
                                    <td className="lab-cart__td">
                                        <span className={statusBadgeClass(item.status)}>
                                            {item.status || "unknown"}
                                        </span>
                                    </td>
                                    <td className="lab-cart__td">
                                        <div className="lab-cart__qty" role="group" aria-label={`Quantity for ${item.item_name}`}>
                                            <button
                                                type="button"
                                                className="lab-cart__qty-btn"
                                                onClick={() => this.handleQuantityChange(item, -1)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus aria-hidden />
                                            </button>
                                            <span className="lab-cart__qty-value">{item.quantity}</span>
                                            <button
                                                type="button"
                                                className="lab-cart__qty-btn"
                                                onClick={() => this.handleQuantityChange(item, 1)}
                                                disabled={item.quantity >= MAX_QUANTITY}
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus aria-hidden />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="lab-cart__td">
                                        <div className="lab-cart__row-actions">
                                            <button
                                                type="button"
                                                className="lab-cart__btn-ghost"
                                                onClick={() => this.openModal(item)}
                                            >
                                                <FaEye aria-hidden />
                                                View
                                            </button>
                                            <button
                                                type="button"
                                                className="lab-cart__btn-danger"
                                                onClick={() => this.handleRemove(item)}
                                            >
                                                <FaTrashAlt aria-hidden />
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lab-cart__footer-actions">
                    {confirmClear ? (
                        <div className="lab-cart__clear-confirm">
                            <p className="lab-cart__clear-text">Remove all items from your cart?</p>
                            <div className="lab-cart__row-actions">
                                <button type="button" className="lab-cart__btn-ghost" onClick={this.cancelClearCart}>
                                    Cancel
                                </button>
                                <button type="button" className="lab-cart__btn-danger" onClick={this.confirmClearCart}>
                                    Yes, clear
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" className="lab-cart__btn-danger" onClick={this.requestClearCart}>
                            <FaTrashAlt aria-hidden />
                            Clear cart
                        </button>
                    )}
                </div>
            </>
        );
    }

    renderSummary(user) {
        const { cart, loading } = this.context;
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const uniqueLines = cart.length;
        const canCheckout = Boolean(user) && cart.length > 0 && !loading;

        return (
            <aside className="lab-cart__summary-card" aria-label="Order summary">
                <div className="lab-cart__card-head">
                    <h3 className="lab-cart__card-title">Summary</h3>
                    <FaShoppingCart aria-hidden />
                </div>
                <div className="lab-cart__summary-body">
                    <div className="lab-cart__summary-row">
                        <span className="lab-cart__summary-label">Line items</span>
                        <span className="lab-cart__summary-value">{uniqueLines}</span>
                    </div>
                    <div className="lab-cart__summary-row">
                        <span className="lab-cart__summary-label">Total quantity</span>
                        <span className="lab-cart__summary-value">{totalItems}</span>
                    </div>
                    <div className="lab-cart__summary-row">
                        <span className="lab-cart__summary-label">Sync</span>
                        <span className="lab-cart__summary-value">{user ? "Server" : "This browser"}</span>
                    </div>
                    <button
                        type="button"
                        className="lab-cart__btn-primary"
                        onClick={() => this.handleCheckout(user)}
                        disabled={!canCheckout}
                    >
                        Proceed to checkout
                    </button>
                    {!user && cart.length > 0 && (
                        <p className="lab-cart__alert-text" style={{ marginTop: "0.5rem", textAlign: "center" }}>
                            <Link to="/management/signin" className="lab-cart__alert-link">
                                Sign in
                            </Link>{" "}
                            to save your cart on the server.
                        </p>
                    )}
                </div>
            </aside>
        );
    }

    render() {
        const { cart, loading } = this.context;
        const { isModalOpen, selectedItem, feedback } = this.state;
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const uniqueLines = cart.length;

        return (
            <AuthContext.Consumer>
                {(auth) => {
                    const user = auth?.user;
                    return (
                        <section className="lab-cart" aria-labelledby="lab-cart-heading">
                            <header className="lab-cart__header">
                                <p className="lab-cart__eyebrow">Customer</p>
                                <h2 id="lab-cart-heading" className="lab-cart__title">
                                    Collection cart
                                    {!loading && (
                                        <span className="lab-cart__count"> · {totalItems} items</span>
                                    )}
                                </h2>
                                <p className="lab-cart__subtitle">
                                    Review quantities before checkout. Signed-in users sync the cart with the server;
                                    guests keep items in this browser only.
                                </p>
                            </header>

                            {!user && (
                                <div className="lab-cart__alert" role="status">
                                    <p className="lab-cart__alert-text">
                                        You are browsing as a guest. Cart changes are stored locally until you sign in.
                                    </p>
                                    <Link to="/management/signin" className="lab-cart__alert-link">
                                        Sign in
                                    </Link>
                                </div>
                            )}

                            {feedback && (
                                <p
                                    className={`lab-cart__feedback${feedback.isError ? " lab-cart__feedback--error" : ""}`}
                                    role="status"
                                >
                                    {feedback.message}
                                </p>
                            )}

                            <div className="lab-cart__layout">
                                <div className="lab-cart__main-card">
                                    <div className="lab-cart__card-head">
                                        <h3 className="lab-cart__card-title">Items</h3>
                                        {cart.length > 0 && (
                                            <span className="lab-cart__item-meta">{uniqueLines} lines</span>
                                        )}
                                    </div>
                                    {this.renderMainColumn()}
                                </div>
                                {this.renderSummary(user)}
                            </div>

                            {isModalOpen && selectedItem && (
                                <InventoryDetailsModal
                                    isOpen={isModalOpen}
                                    inventory={selectedItem}
                                    onClose={this.closeModal}
                                />
                            )}
                        </section>
                    );
                }}
            </AuthContext.Consumer>
        );
    }
}

export default Cart;
