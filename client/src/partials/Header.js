
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineHexagon } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaEnvelope } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import React, { useContext, Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


class Header extends Component {
    state = {}

    static contextType = AuthContext;

    handleLogout = () => {
        const { logout } = this.context;
        const navigate = this.props.navigate;

        logout(); // уже делает запрос
        navigate("/login"); // или "/"
    };



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
                <div className="navbar-top sticky-top navbar navbar-expand-lg">
                    <div className="navbar-brand d-flex">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>


                        <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0  text-decoration-none">
                            <MdOutlineHexagon className="logo" />
                        </Link>
                    </div>
                    <div className="navbar-collapse collapse" >
                        <ul className="nav nav-bd  col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

                            <li className="nav-item dropdown">
                                <button className="btn " data-bs-toggle="dropdown" aria-expanded="false">
                                    Home
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>

                            <li className="nav-item dropdown">
                                <button className="btn " data-bs-toggle="dropdown" aria-expanded="false">
                                    Dashboards
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <button className="btn  " data-bs-toggle="dropdown" aria-expanded="false">
                                    Apps
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <button className="btn " data-bs-toggle="dropdown" aria-expanded="false">
                                    Pages
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <button className="btn " data-bs-toggle="dropdown" aria-expanded="false">
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
                        <Link to="/management/signin" role="button" className="btn btn-outline me-2">Sing-in</Link>
                        <Link to="/management/signup" role="button" className="btn btn-lab">Sign-up</Link>
                    </div>
                    <ul className="nav account-nav d-flex align-items-center">

                        <li className="nav-item dropdown ">
                            <a className="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <img src="/images/united-states.png" alt="user-image" className="me-0 me-sm-1" width="20" height="18"></img>
                                <span className="align-middle d-none d-lg-inline-block">English</span> <i className="mdi mdi-chevron-down d-none d-sm-inline-block align-middle"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated" >


                                <a href="" className="dropdown-item">
                                    <img src="/images/germany.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">German</span>
                                </a>

                                <a href="" className="dropdown-item">
                                    <img src="/images/flag.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">Estonian</span>
                                </a>


                                <a href="" className="dropdown-item">
                                    <img src="/images/spain.png" alt="user-image" className="me-1" width="20" height="16"></img>
                                    <span className="align-middle">Spanish</span>
                                </a>


                                <a href="" className="dropdown-item">
                                    <img src="/images/russia.png" alt="user-image" className="me-1" width="20" height="16"></img>
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
                                        <div className="my-2 text-center fw-bold">
                                            <a className="fw-bolder text-decoration-none link-primary" href="/pages/notifications">Notification history</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </li>
                        <li className="nav-item">
                            <a
                                className="px-2 nav-link"
                                role="button"
                                onClick={() => this.handleOffcanvasOpen("offcanvasCart")}>

                                <span className="nav-account-icon">
                                    <FiShoppingCart />
                                </span>
                            </a>
                        </li>
                        <li className="dropdown h-100" >
                            <a className="nav-link p-0 m-3 h-100 d-flex align-items-center" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="nav-account-icon profile">
                                    <FaRegUserCircle />
                                </span>
                            </a>
                            <div className="dropdown-profile dropdown-menu dropdown-menu-end p-0 " data-bs-popper="static">
                                <div className="position-relative border-1 card">
                                    <div className="p-0 card-body">
                                        <div className="d-flex flex-column align-items-center justify-content-center gap-2 pt-4 pb-3">
                                            <Link className="nav-link" to="/customer/profile">
                                                <span className="nav-account-icon profile">
                                                    <FaRegUserCircle />
                                                </span>
                                            </Link>

                                        </div>
                                        <div className="avatar avatar-xl">
                                            <div className="mb-3 mx-3">
                                                <input id="statusUpdate" placeholder="Update your status" type="text" className="form-control form-control-sm"></input>
                                            </div>
                                        </div>
                                        <div className="dropdown-profile-navbar">
                                            <ul className="flex-column navbar-nav">
                                                <li className="nav-item">
                                                    <a className='px-3 nav-link' href="/customer/profile">
                                                        <span className="nav-link-icon">
                                                            <FaRegUserCircle />
                                                        </span>
                                                        <span className="nav-link-text">Profile</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className='px-3 nav-link' href="/customer/profile">
                                                        <span className="nav-link-icon">
                                                            <FiPieChart />
                                                        </span>
                                                        <span className="nav-link-text">Dashboard</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className='px-3 nav-link' href="/customer/profile">
                                                        <span className="nav-link-icon">
                                                            <FaEnvelope />
                                                        </span>
                                                        <span className="nav-link-text">Post & Activity</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className='px-3 nav-link' href="/customer/profile">
                                                        <span className="nav-link-icon">
                                                            <FaGear />
                                                        </span>
                                                        <span className="nav-link-text">Settings</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className='px-3 nav-link' href="/customer/profile">
                                                        <span className="nav-link-icon">
                                                            <FaRegQuestionCircle />
                                                        </span>
                                                        <span className="nav-link-text">Help center</span>
                                                    </a>
                                                </li>
                                            </ul>

                                        </div>

                                    </div>
                                    <div className="p-0 card-footer border-1">

                                        <div className="nav flex-column my-3 navbar-nav">
                                            <div className="nav-item d-inline">
                                                <a href="" className="px-3 nav-link">

                                                    <span>Add another account</span>
                                                </a>
                                            </div>
                                        </div>

                                        <hr></hr>

                                        <div className="px-3">
                                            <button
                                                className="btn btn-secondary d-flex justify-content-center w-100"
                                                onClick={this.handleLogout}
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                        <div className="my-2 text-center small fw-bold fs-10 text-body-quaternary">
                                            <a className=" me-1" href="/">Privacy policy</a>•
                                            <a className=" mx-1" href="/">Terms</a>•
                                            <a className=" ms-1" href="/">Cookies</a>
                                        </div>
                                    </div>


                                </div>
                            </div>

                        </li>

                    </ul>

                </div>

            </header >


        );
    }
}

const HeaderWithNavigate = (props) => {
    const navigate = useNavigate();
    return <Header {...props} navigate={navigate} />;
};

export default HeaderWithNavigate;
