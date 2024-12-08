import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineHexagon } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
// import Order from "./Order";
import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import "bootstrap/dist/js/bootstrap.bundle.min";





class Header extends React.Component {
    handleOffcanvasOpen = (offcanvasId) => {
        const offcanvasElement = document.getElementById(offcanvasId);
        if (offcanvasElement) {
            const bootstrap = require("bootstrap");
            const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
            offcanvasInstance.show();
        }
    };
    
    
    

    render() {
        return (
            <header className="header">
                <div className="navbar-top sticky-top navbar navbar-expand-lg bg-black">
                    <div className="navbar-brand d-flex">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>


                        <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                            <MdOutlineHexagon className="logo" />
                        </Link>
                    </div>
                    <div className="navbar-collapse collapse" >
                        <ul className="nav nav-bd  col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

                            <li className="nav-item dropdown">
                                <button className="btn text-white" data-bs-toggle="dropdown" aria-expanded="false">
                                    Home
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <button className="btn text-white" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dashboards
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <button className="btn text-white " data-bs-toggle="dropdown" aria-expanded="false">
                                    Apps
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <button className="btn text-white" data-bs-toggle="dropdown" aria-expanded="false">
                                    Pages
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <button className="btn text-white" data-bs-toggle="dropdown" aria-expanded="false">
                                    Components
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className="navbar-nav text-end flex-row">
                        <button type="button" className="btn btn-outline-light me-2">Login</button>
                        <button type="button" className="btn btn-lab">Sign-up</button>
                    </div>
                    <ul className="nav account-nav topbar-menu d-flex align-items-center gap-3">

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <img src="./images/united-states.png" alt="user-image" className="me-0 me-sm-1" width="20" height="18"></img>
                                <span className="align-middle d-none d-lg-inline-block">English</span> <i className="mdi mdi-chevron-down d-none d-sm-inline-block align-middle"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated" >


                                <a href="" className="dropdown-item">
                                    <img src="./images/germany.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">German</span>
                                </a>

                                <a href="" className="dropdown-item">
                                    <img src="./images/flag.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">Estonian</span>
                                </a>


                                <a href="" className="dropdown-item">
                                    <img src="./images/spain.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">Spanish</span>
                                </a>


                                <a href="" className="dropdown-item">
                                    <img src="./images/russia.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">Russian</span>
                                </a>

                            </div>
                        </li>
                        <li className="dropdown notification-list">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">

                                <span className="nav-account-icon">
                                    <FaRegBell />
                                </span>
                            </a>
                            <div data-bs-popper="static" id="dropdown" className=" py-0 notification-dropdown-menu shadow border dropdown-menu dropdown-menu-end">
                                <div className="position-relative border-0 text-bg-dark card">
                                    <div className="p-2 card-header ">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className=" mb-0">Notifications</h5>
                                            <button type="button" className="p-0 fs-9 fw-normal btn btn-link">Mark all as read</button>
                                        </div>
                                    </div>
                                    <div className="p-0 card-body">
                                        <div data-bs-spy="scroll" data-bs-target="#navbar-example3" data-bs-smooth-scroll="true" className="notification-scrollbar navbar-nav navbar-nav-scroll" tabIndex="0">

                                        </div>

                                    </div>
                                    <div className="p-0 border-top card-footer">
                                        <div className="my-2 text-center fw-bold fs-10 text-body-tertiary text-opactity-85">
                                            <a className="fw-bolder" href="/pages/notifications">Notification history</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </li>
                        <li className="nav-item">
                            <a
                                className="px-2 icon-indicator icon-indicator-primary nav-link"
                                role="button"
                                onClick={() => this.handleOffcanvasOpen("offcanvasAccount")}>

                                <span className="nav-account-icon">
                                    <FiShoppingCart />
                                </span>
                            </a>
                        </li>

                    </ul>

                </div>

            </header>


        );
    }
}

export default Header;
