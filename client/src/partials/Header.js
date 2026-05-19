import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHexagon } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegBell, FaRegUserCircle } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiPieChart } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { usePanel } from "../context/PanelContext";

const CREATE_SOON_HINT = "Planned in a future release";

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

function CreateSoonRow({ label, hint }) {
    return (
        <li>
            <span className="lab-header__dropdown-item lab-header__dropdown-item--soon-stack" title={CREATE_SOON_HINT} aria-label={`${label}. ${CREATE_SOON_HINT}`}>
                <span className="lab-header__dropdown-item--soon-stack__body">
                    <span className="lab-header__dropdown-item--soon-stack__title">{label}</span>
                    {hint ? <span className="lab-header__dropdown-item--soon-stack__hint">{hint}</span> : null}
                </span>
                <span className="lab-header__soon-badge">Soon</span>
            </span>
        </li>
    );
}

function MyWorkMenuBody({ user, closeMenus }) {
    if (!user) {
        return (
            <>
                <li role="presentation">
                    <p className="lab-header__mywork-empty">
                        Sign in to see open tasks, drafts, and logistics queues assigned to you in one place.
                    </p>
                </li>
                <li>
                    <Link to="/management/signin" className="lab-header__dropdown-item" onClick={closeMenus}>
                        Sign in
                    </Link>
                </li>
            </>
        );
    }

    return (
        <>
            <li role="presentation">
                <div className="lab-header__dropdown-heading">Needs attention</div>
            </li>
            <li role="presentation">
                <p className="lab-header__mywork-empty">
                    No overdue tasks in your personal queue yet. When the queue API is connected, this block will list due and overdue items first.
                </p>
            </li>
            <li role="presentation">
                <div className="lab-header__dropdown-heading">In progress</div>
            </li>
            <li role="presentation">
                <p className="lab-header__mywork-empty">
                    No open tasks assigned to you in this snapshot. You can always review the full board in the task list.
                </p>
            </li>
            <li>
                <hr className="dropdown-divider my-1" />
            </li>
            <li role="presentation">
                <div className="lab-header__dropdown-heading">Drafts &amp; unfinished</div>
            </li>
            <li role="presentation">
                <p className="lab-header__mywork-empty">
                    Unsaved forms and draft researches will surface here so you can resume without hunting through lists.
                </p>
            </li>
            <CreateSoonRow label="Resume last draft" hint="Jump back to autosaved research or intake forms" />
            <li>
                <hr className="dropdown-divider my-1" />
            </li>
            <li role="presentation">
                <div className="lab-header__dropdown-heading">Logistics &amp; handoffs</div>
            </li>
            <CreateSoonRow label="Incomplete goods receipts" hint="Receiving sessions started but not closed to stock" />
            <CreateSoonRow label="Transfer requests" hint="Internal moves waiting for pick or approval" />
            <li>
                <hr className="dropdown-divider my-1" />
            </li>
            <li role="presentation">
                <div className="lab-header__dropdown-heading">Collaboration</div>
            </li>
            <CreateSoonRow label="Mentions &amp; review requests" hint="Comments that need your reply or sign-off" />
            <li role="presentation">
                <p className="lab-header__dropdown-footnote">
                    This panel is your working queue, not the full app map. Live items, badges, and snooze will come from a dedicated queue or notification service.
                </p>
            </li>
            <li>
                <NavLink to="/projects/task-list" className="lab-header__dropdown-item" onClick={closeMenus}>
                    Open task list
                </NavLink>
            </li>
            <li>
                <NavLink to="/projects/research-list" className="lab-header__dropdown-item" onClick={closeMenus}>
                    Open research list
                </NavLink>
            </li>
        </>
    );
}

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { openPanel } = usePanel();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);

    const createRef = useRef(null);
    const myWorkRef = useRef(null);
    const userRef = useRef(null);
    const notifyRef = useRef(null);

    const closeMenus = useCallback(() => setMenuOpen(null), []);

    useCloseOnOutsideClick(createRef, menuOpen === "create", closeMenus);
    useCloseOnOutsideClick(myWorkRef, menuOpen === "mywork", closeMenus);
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
                        <MdOutlineHexagon className="logo" style={{ width: "4rem", height: "4rem" }} />
                    </Link>
                </div>

                <div
                    id="header-nav-collapse"
                    className={`lab-header__nav-desktop ${mobileNavOpen ? "d-flex flex-column flex-lg-row flex-wrap" : "d-none d-lg-flex"} align-items-lg-center`}
                >
                    <ul className="lab-header__nav-list">
                        <li className="lab-header__dropdown-wrap lab-header__dropdown-wrap--mywork" ref={myWorkRef}>
                            <button
                                type="button"
                                className="lab-header__mywork-btn"
                                aria-expanded={menuOpen === "mywork"}
                                aria-haspopup="menu"
                                onClick={() => toggleMenu("mywork")}
                            >
                                <span className="lab-header__mywork-btn__icon" aria-hidden>
                                    <LuClipboardList />
                                </span>
                                <span>My work</span>
                            </button>
                            {menuOpen === "mywork" ? (
                                <ul className="lab-header__dropdown lab-header__dropdown--wide lab-header__dropdown--scroll" role="menu" aria-label="My work">
                                    <MyWorkMenuBody user={user} closeMenus={closeMenus} />
                                </ul>
                            ) : null}
                        </li>
                        <li className="lab-header__dropdown-wrap lab-header__dropdown-wrap--create" ref={createRef}>
                            <button
                                type="button"
                                className="lab-header__create-btn"
                                aria-expanded={menuOpen === "create"}
                                aria-haspopup="menu"
                                onClick={() => toggleMenu("create")}
                            >
                                <span className="lab-header__create-btn__icon" aria-hidden>
                                    <IoAdd />
                                </span>
                                <span className="lab-header__create-btn__label">Create</span>
                            </button>
                            {menuOpen === "create" ? (
                                <ul className="lab-header__dropdown lab-header__dropdown--wide" role="menu" aria-label="Create">
                                    <li role="presentation">
                                        <div className="lab-header__dropdown-heading">Research &amp; work</div>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/projects/research-create"
                                            className="lab-header__dropdown-item lab-header__dropdown-item--stacked"
                                            onClick={closeMenus}
                                        >
                                            <span className="lab-header__dropdown-item__title">New research</span>
                                            <span className="lab-header__dropdown-item__hint">Open a new study or experiment record</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/projects/task-create"
                                            className="lab-header__dropdown-item lab-header__dropdown-item--stacked"
                                            onClick={closeMenus}
                                        >
                                            <span className="lab-header__dropdown-item__title">New task</span>
                                            <span className="lab-header__dropdown-item__hint">Assign work linked to projects</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider my-1" />
                                    </li>
                                    <li role="presentation">
                                        <div className="lab-header__dropdown-heading">Samples &amp; traceability</div>
                                    </li>
                                    <CreateSoonRow label="Register sample" hint="Chain of custody, location, and metadata" />
                                    <CreateSoonRow label="Register aliquot" hint="Split from parent sample with full lineage" />
                                    <li>
                                        <hr className="dropdown-divider my-1" />
                                    </li>
                                    <li role="presentation">
                                        <div className="lab-header__dropdown-heading">Logistics &amp; procurement</div>
                                    </li>
                                    <CreateSoonRow label="Goods receipt" hint="Record incoming deliveries against orders" />
                                    <CreateSoonRow label="Purchase requisition" hint="Internal request before a PO is raised" />
                                    <CreateSoonRow label="Stock adjustment" hint="Corrections after count or spillage" />
                                    <li>
                                        <hr className="dropdown-divider my-1" />
                                    </li>
                                    <li role="presentation">
                                        <div className="lab-header__dropdown-heading">Storage structure</div>
                                    </li>
                                    <CreateSoonRow label="New warehouse" hint="Top-level site or storage building" />
                                    <CreateSoonRow label="New storage unit" hint="Shelf, freezer, or container in the tree" />
                                    <li role="presentation">
                                        <p className="lab-header__dropdown-footnote">
                                            Lists, trees, and lab modules stay in the left sidebar — this menu is only for starting something new.
                                        </p>
                                    </li>
                                </ul>
                            ) : null}
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
                                            <FaRegUserCircle style={{ width: "2rem",height: "2rem", marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            <FiPieChart style={{ width: "2rem", height: "2rem", marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/customer/profile" className="lab-header__dropdown-item" onClick={closeMenus}>
                                            <FaEnvelope style={{ width: "2rem", height: "2rem", marginRight: "0.35rem", verticalAlign: "text-bottom" }} />
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
