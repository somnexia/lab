
import React, { Component } from "react";
import axios from 'axios';
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import InventoryDetailsModal from "./InventoryDetailsModal";

class Cart extends Component {
    static contextType = CartContext;
    state = {
        isModalOpen: false,
        selectedItem: null,
    };
    openModal = (item) => {
        this.setState({
            isModalOpen: true,
            selectedItem: item,
        });
    };
    closeModal = () => {
        this.setState({
            isModalOpen: false,
            selectedItem: null,
        });
    };
    

    // handleAddToCart = (inventory) => {
    //     const { addToCart } = this.context;
    //     const { user } = this.contextType ? this.contextType.contextType(AuthContext) : {};

    //     if (user) {
    //         addToCart(inventory); // Добавляем товар в корзину, если пользователь авторизован
    //     } else {
    //         alert("Пожалуйста, авторизуйтесь для добавления товаров в корзину.");
    //     }

    //     console.log("inventory:", inventory)
    //     console.log("inventory:", inventory.length)
    // };

    // handleRemoveFromCart = (itemId) => {
    //     const { removeFromCart } = this.context;
    //     const { user } = this.contextType ? this.contextType.contextType(AuthContext) : {};

    //     if (user) {
    //         removeFromCart(itemId); // Удаление синхронизируется с сервером
    //     } else {
    //         alert("Пожалуйста, авторизуйтесь, чтобы сохранить изменения в корзине.");
    //     }
    // };

    render() {
        const { cart, addToCart, removeFromCart, updateCartQuantity } = this.context; // CartContext
        const { isModalOpen, selectedItem } = this.state;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        return (
            <AuthContext.Consumer>
                {({ user }) => (
                    <div>
                        <h2>Cart</h2>
                        <hr />
                        {/* {user ? (
                            <div></div>
                        ) : (
                            <div>
                                <p>You are not authorized. Please authorize to save the cart.</p>
                                <p>
                                    Click{" "}
                                    <a className="text-decoration-none" href="/management/signin">
                                        here
                                    </a>{" "}
                                    to sign in...
                                </p>
                            </div>
                        )} */}



                        <div className="row g-4 my-2">
                            <div className="col-lg-8 col-12">
                                {cart.length > 0 ? (
                                    <div>
                                        <div className="table-responsive" data-bs-theme="dark">
                                            <table className="table cart-table table-hover bg-transparent">
                                                <thead>
                                                    <tr>
                                                        <th>Quantity</th>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Substance Amount</th>
                                                        <th>Unit Measure</th>
                                                        <th>Supplier</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <select
                                                                    className="form-select"
                                                                    value={item.quantity}
                                                                    onChange={(e) =>
                                                                        updateCartQuantity(
                                                                            item.id,
                                                                            parseInt(e.target.value, 10)
                                                                        )
                                                                    }
                                                                >
                                                                    {[...Array(10).keys()].map((n) => (
                                                                        <option key={n + 1} value={n + 1}>
                                                                            {n + 1}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td>#{item.item_id}</td>
                                                            <td>{item.item_name}</td>
                                                            <td>{item.substance_amount}</td>
                                                            <td>{item.unit_measure}</td>
                                                            <td>{item.supplier}</td>
                                                            <td>
                                                                <strong
                                                                    className={`text-${item.status === "available"
                                                                        ? "success"
                                                                        : item.status === "in use"
                                                                            ? "warning"
                                                                            : item.status === "reserved"
                                                                                ? "info"
                                                                                : "danger"
                                                                        }`}
                                                                >
                                                                    {item.status}
                                                                </strong>
                                                            </td>
                                                            <td className="row row-gap-2 px-3">
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => removeFromCart(item.id)}
                                                                >
                                                                    Remove
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => this.openModal(item)}
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="main-cart-actions d-flex justify-content-end py-3">
                                            <button onClick={this.context.clearCart} type="button" className="btn btn-lg btn-secondary rounded-0 "> Clear Cart</button>
                                        </div>
                                    </div>


                                ) : (
                                    <div>
                                        <p>You have no items in your collection cart.</p>
                                        <p>
                                            Click{" "}
                                            <a className="text-decoration-none" href="/">
                                                here
                                            </a>{" "}
                                            to continue shopping...
                                        </p>
                                    </div>
                                )}

                            </div>
                            <div className="col-lg-4 col-12">
                                <div className="cart-card card bg-body-emphasis border-0" data-bs-theme="dark">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-4">
                                            <h3 className="mb-0">Summary</h3>
                                            <a className="d-flex align-items-center" href="#">
                                                Edit cart
                                            </a>
                                        </div>
                                        <ul className="list-group list-group-flush mb-4 mt-3">
                                            <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-top border-bottom">
                                                Total items <span>{totalItems}</span>
                                            </li>
                                        </ul>
                                        <button type="button" className="w-100 btn btn-lab mt-4">
                                            Proceed to Checkout
                                        </button>
                                        {user ? (
                                            <div></div>
                                        ) : (
                                            <p className="text-danger text-center mt-3">
                                                You are not authorized. Please authorize to save the cart.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isModalOpen && selectedItem && (
                            <InventoryDetailsModal
                                isOpen={isModalOpen}
                                inventory={selectedItem}
                                onClose={this.closeModal}
                            />
                        )}
                    </div>
                )
                }
            </AuthContext.Consumer>
        );
    };
};

export default Cart;
