import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext); // Используем контекст корзины

    const totalItems = cart.length;

    return (
        <>
            <h2 className="mb-4">Cart</h2>
            <div className="row g-5">
                <div className="col-lg-8 col-12">
                    <div className="table-responsive">
                        <table className="table table-dark table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Group</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length > 0 ? (
                                    cart.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.group}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Your cart is empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-4 col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex flex-between-center mb-3">
                                <h3 className="mb-0">Summary</h3>
                                <a className="btn btn-link p-0" href="#">
                                    Edit cart
                                </a>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total items
                                    <span>{totalItems}</span>
                                </li>
                            </ul>
                            <button type="button" className="w-100 btn btn-primary mt-3">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
