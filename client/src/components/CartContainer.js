import React, { Component } from "react";
import Cart from "./Cart";
import CardOffcanvas from "./CartOffcanvas";

class CartContainer extends Component {
    state = {
        isExpanded: false,
    };

    toggleCartView = () => {
        this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
    };

    render() {
        return (
            <div>
                {this.state.isExpanded ? (
                    <Cart />
                ) : (
                    <CardOffcanvas onExpand={this.toggleCartView} />
                )}
            </div>
        );
    }
}

export default CartContainer;
