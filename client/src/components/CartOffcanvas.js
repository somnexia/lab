import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { usePanel } from "../context/PanelContext";

const CartOffcanvas = () => {
    const { cart, removeFromCart, updateCartQuantity } = useContext(CartContext);
    const { activePanel, closePanel } = usePanel();
    const isOpen = activePanel === "cart";
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div
            className={`offcanvas cart-offcanvas offcanvas-end${isOpen ? " show" : ""}`}
            tabIndex={-1}
            id="offcanvasCart"
            aria-hidden={!isOpen}
            aria-labelledby="offcanvasCartLabel"
        >
            <div className="offcanvas-body">
                <div className="card bg-body-emphasis border-0" data-bs-theme="dark">
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <h4 className="mb-0" id="offcanvasCartLabel">
                            Your Cart
                        </h4>
                        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={closePanel} />
                    </div>

                    <div className="card-body mt-3">
                        {cart.length > 0 ? (
                            <ul className="list-group list-group-flush">
                                {cart.map((item) => (
                                    <li
                                        className="list-group-item d-flex justify-content-between bg-transparent border-top border-bottom"
                                        key={item.id}
                                    >
                                        <div className="d-flex flex-column gap-1">
                                            <div>
                                                <strong className="pe-3">#{item.item_id}</strong>
                                                <strong>{item.item_name}</strong>
                                            </div>
                                            <span className="mb-3">{item.supplier}</span>
                                            <select
                                                className="quantity-select form-select form-select-sm"
                                                value={item.quantity}
                                                onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value, 10))}
                                            >
                                                {[...Array(10).keys()].map((n) => (
                                                    <option key={n + 1} value={n + 1}>
                                                        {n + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="d-flex flex-column justify-content-end">
                                            <button type="button" className="align-bottom lab-link btn btn-link btn-sm p-0" onClick={() => removeFromCart(item.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                        <hr />
                        <div className="mt-3 row g-3">
                            <div className="col-6">
                                <Link to="/customer/cart" className="btn btn-outline-light w-100 h-100 align-middle" onClick={closePanel}>
                                    Go to cart ({totalItems})
                                </Link>
                            </div>
                            <div className="col-6">
                                <button type="button" className="btn btn-lab w-100 h-100 align-middle">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartOffcanvas;
