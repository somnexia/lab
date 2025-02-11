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
        const { cart, removeFromCart, updateCartQuantity } = this.context;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        return (
            <div
                className="offcanvas cart-offcanvas  offcanvas-end "
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
                    <div className="card bg-body-emphasis border-0" data-bs-theme="dark" >
                        <div className="card-header d-flex align-items-center justify-content-between  ">
                            <h4 className="" id="offcanvasCartLabel">Your Cart</h4>
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
                                <ul className="list-group list-group-flush ">
                                    {cart.map((item) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between bg-transparent border-top border-bottom"
                                            key={item.id}
                                        >
                                            <div className="d-flex flex-column gap-1">
                                                <div className="">

                                                    <strong className="pe-3">#{item.item_id}</strong>
                                                    <strong className="">{item.item_name}</strong>
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

                                                {/* <span>{item.model || `${item.substance_amount} ${item.unit_measure}`}</span>
                                                <span>{item.unique_id || item.cas_id}</span> */}

                                            </div>
                                            <div className="d-flex flex-column justify-content-end">


                                                <a
                                                    className="align-bottom lab-link"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Remove
                                                </a>
                                            </div>
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
