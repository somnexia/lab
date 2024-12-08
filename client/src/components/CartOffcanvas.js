import React, { Component } from "react";
import { CartContext } from "../context/CartContext";
import Cart from "./Cart";
import { Outlet, Link } from "react-router-dom";

class CartOffcanvas extends Component {

    static contextType = CartContext;


    // componentDidMount() {
    //     const offcanvasElement = document.getElementById("offcanvasCart");
    //     if (offcanvasElement) {
    //         try {
    //             const bootstrap = require("bootstrap");
    //             const Offcanvas = bootstrap.Offcanvas;
    //             new Offcanvas(offcanvasElement);
    //         } catch (error) {
    //             console.error("Ошибка при инициализации Offcanvas:", error);
    //         }
    //     }
    // }
    



    render() {
        const { cart, removeFromCart } = this.context;
        const totalItems = cart.length;

        return (
            <div
                className="offcanvas cart-offcanvas  offcanvas-end"
                tabIndex="-1"
                id="offcanvasCart"
                aria-labelledby="offcanvasCartLabel"
            >
                {/* <div className="offcanvas-header text-white">
                    <h4 id="offcanvasCartLabel">Your Cart</h4>
                    <button
                        type="button"
                        className="btn-close custom-white"
                        data-bs-theme="dark"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div> */}
                <div className="offcanvas-body">
                    <div className="card bg-body-emphasis border-0  text-bg-dark">
                        <div className="card-header d-flex align-items-center justify-content-between  ">
                            <h4 id="offcanvasCartLabel">Your Cart</h4>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-theme="dark"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                            ></button>

                        </div>

                        <div className="card-body mt-3">
                            {cart.length > 0 ? (
                                <ul className="list-group ">
                                    {cart.map((item) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between align-items-end bg-body-primary text-white"
                                            key={item.id}
                                        >
                                            <div className="d-flex flex-column">
                                                <strong>{item.name}</strong>
                                                <span>{item.model || `${item.substance_amount} ${item.unit_measure}`}</span>
                                                <span>{item.unique_id || item.cas_id}</span>

                                            </div>

                                            <a
                                                className="align-bottom"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                Remove
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                            ) : (
                                <p >Your cart is empty.</p>
                            )}
                            <hr />
                            <div className="mt-3 row g-3">
                                <div className="col-6">
                                    <Link to="/customer/cart" className="btn btn-outline-light w-100 h-100 align-middle">
                                        Go to cart({totalItems})
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <a className="btn btn-lab w-100 h-100 align-middle    ">
                                        Checkout
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CartOffcanvas;
