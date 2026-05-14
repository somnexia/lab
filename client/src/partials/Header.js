import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHexagon } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { usePanel } from "../context/PanelContext";

function useCloseOnOutsideClick(ref, isOpen, onClose) {
    useEffect(() => {
        if (!isOpen) return undefined;
        const handle = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, [isOpen, onClose, ref]);
}

const navLinkClass = ({ isActive }) =>
    `lab-header__link${isActive ? " lab-header__link--active" : ""}`;

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { openPanel, closePanel } = usePanel();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);

    const projectsRef = useRef(null);
    const inventoryRef = useRef(null);
    const userRef = useRef(null);
    const notifyRef = useRef(null);

    const closeMenus = useCallback(() => setMenuOpen(null), []);

    useCloseOnOutsideClick(projectsRef, menuOpen === "projects", closeMenus);
    useCloseOnOutsideClick(inventoryRef, menuOpen === "inventory", closeMenus);
    useCloseOnOutsideClick(userRef, menuOpen === "user", closeMenus);
    useCloseOnOutsideClick(notifyRef, menuOpen === "notify", closeMenus);

    useEffect(() => {
        setMobileNavOpen(false);
        closeMenus();
    }, [location.pathname, closeMenus]);

    const handleLogout = () => {
        closeMenus();
        navigate("/management/signout");
    };

    const toggleMenu = (key) => {
        setMenuOpen((prev) => (prev === key ? null : key));
    };

    return (
        <header className="header lab-header">
            <div className="navbar-top sticky-top navbar navbar-expand-lg">
                <div className="lab-header__brand">
                    <button
                        type="button"
                        className="navbar-toggler d-lg-none"
                        aria-controls="header-nav-collapse"
                        aria-expanded={mobileNavOpen}
                        aria-label="Меню"
                        onClick={() => setMobileNavOpen((o) => !o)}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <Link to="/" className="d-flex align-items-center text-decoration-none">
                        <MdOutlineHexagon className="logo" />
                    </Link>
                </div>

                <div
                    id="header-nav-collapse"
                    className={`lab-header__nav-desktop ${mobileNavOpen ? "d-flex flex-column flex-lg-row flex-wrap" : "d-none d-lg-flex"} align-items-lg-center`}
                >
                    <ul className="lab-header__nav-list">
                        <li>
                            <NavLink to="/" end className={navLinkClass}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="lab-header__dropdown-wrap" ref={inventoryRef}>
                            <button
                                type="button"
                                className="lab-header__link"
                                aria-expanded={menuOpen === "inventory"}
                                onClick={() => toggleMenu("inventory")}
                            >
                                Inventory
                                <span className="lab-header__chev">▾</span>
                            </button>
                            {menuOpen === "inventory" ? (
                                <ul className="lab-header__dropdown" role="menu">
                                    <li>
                                        <NavLink to="/inventory/overview" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            Overview
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/inventory/warehouses" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            Warehouses
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/inventory/storage-units" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            Storage units
                                        </NavLink>
                                    </li>
                                </ul>
                            ) : null}
                        </li>
                        <li className="lab-header__dropdown-wrap" ref={projectsRef}>
                            <button
                                type="button"
                                className="lab-header__link"
                                aria-expanded={menuOpen === "projects"}
                                onClick={() => toggleMenu("projects")}
                            >
                                Projects
                                <span className="lab-header__chev">▾</span>
                            </button>
                            {menuOpen === "projects" ? (
                                <ul className="lab-header__dropdown" role="menu">
                                    <li>
                                        <NavLink to="/projects" end className="lab-header__dropdown-item" onClick={closeMenus}>
                                            Overview
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/projects/research-list" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            Researches
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/projects/research-create" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            New research
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/projects/task-list" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            Tasks
                                        </NavLink>
                                    </li>
                                </ul>
                            ) : null}
                        </li>
                        <li>
                            <NavLink to="/equipment" className={navLinkClass}>
                                Equipment
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/teams/participants" className={navLinkClass}>
                                Teams
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="lab-header__actions">
                    {!user ? (
                        <>
                            <Link to="/management/signin" className="btn btn-outline btn-sm me-1">
                                Sign in
                            </Link>
                            <Link to="/management/signup" className="btn btn-primary btn-sm">
                                Sign up
                            </Link>
                        </>
                    ) : null}

                    {user ? (
                        <div className="lab-header__dropdown-wrap" ref={notifyRef}>
                            <button
                                type="button"
                                className="lab-header__icon-btn"
                                aria-label="Уведомления"
                                aria-expanded={menuOpen === "notify"}
                                onClick={() => toggleMenu("notify")}
                            >
                                <FaRegBell />
                            </button>
                            {menuOpen === "notify" ? (
                                <ul className="lab-header__dropdown lab-header__dropdown--end" style={{ minWidth: "16rem" }}>
                                    <li className="px-2 py-2 small text-body-secondary">Нет новых уведомлений</li>
                                </ul>
                            ) : null}
                        </div>
                    ) : null}

                    <button
                        type="button"
                        className="lab-header__icon-btn"
                        aria-label="Корзина"
                        onClick={() => {
                            closeMenus();
                            openPanel("cart");
                        }}
                    >
                        <FiShoppingCart />
                    </button>

                    {user ? (
                        <div className="lab-header__dropdown-wrap" ref={userRef}>
                            <button
                                type="button"
                                className="lab-header__icon-btn"
                                aria-label="Аккаунт"
                                aria-expanded={menuOpen === "user"}
                                onClick={() => toggleMenu("user")}
                            >
                                <FaRegUserCircle />
                            </button>
                            {menuOpen === "user" ? (
                                <ul className="lab-header__dropdown lab-header__dropdown--end" role="menu">
                                    <li>
                                        <Link to="/customer/profile" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            <FaRegUserCircle style={{ marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            <FiPieChart style={{ marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/customer/profile" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            <FaEnvelope style={{ marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Activity
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="lab-header__dropdown-item"
                                            onClick={() => {
                                                closeMenus();
                                                openPanel("settings");
                                            }}
                                        >
                                            <FaGear style={{ marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Settings
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            <FaRegQuestionCircle style={{ marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Help
                                        </button>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button type="button" className="lab-header__dropdown-item text-danger" onClick={handleLogout}>
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

export default Header;
