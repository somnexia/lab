import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { PanelContext } from "../context/PanelContext";

const MAX_QUANTITY = 20;

class CartDrawer extends Component {
    static contextType = CartContext;

    state = {
        feedback: null,
    };

    _closePanelRef = null;

    componentDidMount() {
        document.addEventListener("keydown", this.handleDocumentKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
        window.clearTimeout(this._feedbackTimer);
    }

    handleDocumentKeyDown = (event) => {
        if (event.key === "Escape" && this._closePanelRef) {
            this._closePanelRef();
        }
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
        this.showFeedback(`Removed "${item.item_name || "item"}".`);
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
        this.showFeedback("Checkout is not configured yet — open the full cart to review items.");
    };

    renderLineItem = (item) => (
        <li key={item.id} className="lab-cart-drawer__item">
            <div className="lab-cart-drawer__item-main">
                <p className="lab-cart-drawer__item-name" title={item.item_name}>
                    {item.item_name || "Unnamed item"}
                </p>
                <p className="lab-cart-drawer__item-meta">
                    #{item.item_id}
                    {item.supplier ? ` · ${item.supplier}` : ""}
                </p>
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
            </div>
            <button type="button" className="lab-cart__btn-danger lab-cart-drawer__remove" onClick={() => this.handleRemove(item)}>
                <FaTrashAlt aria-hidden />
                Remove
            </button>
        </li>
    );

    renderDrawerBody = (panel, auth) => {
        const { activePanel, closePanel } = panel;
        const isOpen = activePanel === "cart";
        this._closePanelRef = isOpen ? closePanel : null;

        const { cart, loading } = this.context;
        const user = auth?.user;
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const { feedback } = this.state;

        if (!isOpen) {
            return null;
        }

        return (
            <aside
                className="lab-cart-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="lab-cart-drawer-title"
                id="lab-cart-drawer"
            >
                <header className="lab-cart-drawer__header">
                    <div>
                        <p className="lab-cart-drawer__eyebrow">Quick view</p>
                        <h2 id="lab-cart-drawer-title" className="lab-cart-drawer__title">
                            Collection cart
                            {!loading && totalItems > 0 ? (
                                <span className="lab-cart-drawer__count"> · {totalItems} items</span>
                            ) : null}
                        </h2>
                    </div>
                    <button type="button" className="lab-cart-drawer__close" aria-label="Close cart panel" onClick={closePanel}>
                        ×
                    </button>
                </header>

                <div className="lab-cart-drawer__body">
                    {!user && (
                        <p className="lab-cart-drawer__hint">
                            Guest cart — stored in this browser only.{" "}
                            <Link to="/management/signin" className="lab-cart__alert-link" onClick={closePanel}>
                                Sign in
                            </Link>{" "}
                            to sync with the server.
                        </p>
                    )}

                    {feedback ? (
                        <p
                            className={`lab-cart__feedback${feedback.isError ? " lab-cart__feedback--error" : ""}`}
                            role="status"
                        >
                            {feedback.message}
                        </p>
                    ) : null}

                    {loading ? (
                        <p className="lab-cart-drawer__loading">Loading cart…</p>
                    ) : cart.length === 0 ? (
                        <div className="lab-cart-drawer__empty">
                            <p>Your cart is empty.</p>
                            <Link to="/inventory/overview" className="lab-cart__btn-primary lab-cart-drawer__empty-link" onClick={closePanel}>
                                Browse inventory
                            </Link>
                        </div>
                    ) : (
                        <ul className="lab-cart-drawer__list">{cart.map((item) => this.renderLineItem(item))}</ul>
                    )}
                </div>

                <footer className="lab-cart-drawer__footer">
                    <Link
                        to="/customer/cart"
                        className="lab-cart__btn-ghost lab-cart-drawer__footer-btn"
                        onClick={closePanel}
                    >
                        Open full cart
                        {totalItems > 0 ? ` (${totalItems})` : ""}
                    </Link>
                    <button
                        type="button"
                        className="lab-cart__btn-primary lab-cart-drawer__footer-btn"
                        onClick={() => this.handleCheckout(user)}
                        disabled={loading || cart.length === 0}
                    >
                        Checkout
                    </button>
                </footer>
            </aside>
        );
    };

    render() {
        return (
            <PanelContext.Consumer>
                {(panel) => (
                    <AuthContext.Consumer>{(auth) => this.renderDrawerBody(panel, auth)}</AuthContext.Consumer>
                )}
            </PanelContext.Consumer>
        );
    }
}

export default CartDrawer;
