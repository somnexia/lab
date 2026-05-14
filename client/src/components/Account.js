import React from "react";
import { Link } from "react-router-dom";
import { usePanel } from "../context/PanelContext";

const Account = () => {
    const { activePanel, closePanel } = usePanel();
    const isOpen = activePanel === "account";

    return (
        <div
            className={`offcanvas offcanvas-end text-bg-dark${isOpen ? " show" : ""}`}
            id="offcanvasAccount"
            tabIndex={-1}
            aria-hidden={!isOpen}
            aria-labelledby="offcanvasAccountLabel"
        >
            <div className="offcanvas-header" />
            <div className="offcanvas-body position-relative">
                <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" aria-label="Close" onClick={closePanel} />
                <div className="text-center pt-2">
                    <img src="/designer-life.svg" alt="" />
                </div>
                <h2 className="text-center mb-2" id="offcanvasAccountLabel">
                    Account
                </h2>
                <p className="text-center mb-4 text-body-secondary small">Quick links to profile and cart.</p>
                <hr className="mb-4" />
                <div className="d-grid gap-2">
                    <Link to="/customer/profile" className="btn btn-outline-light" onClick={closePanel}>
                        Profile
                    </Link>
                    <Link to="/customer/cart" className="btn btn-outline-light" onClick={closePanel}>
                        Cart
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Account;
