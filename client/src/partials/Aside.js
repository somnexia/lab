import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { BsBoxes } from "react-icons/bs";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FaFlask } from "react-icons/fa6";
import { GrGroup } from "react-icons/gr";
import { IoGameController } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { usePanel } from "../context/PanelContext";
import { useAsideLayout } from "../context/AsideLayoutContext";

function subLinkClass({ isActive }) {
    return `lab-aside__sublink${isActive ? " lab-aside__sublink--active" : ""}`;
}

function topLinkClass({ isActive }) {
    return `lab-aside__trigger text-decoration-none${isActive ? " is-active" : ""}`;
}

function NavGroup({ id, title, icon: Icon, expanded, onToggle, children }) {
    const open = Boolean(expanded[id]);
    return (
        <li className="lab-aside__group">
            <button
                type="button"
                className={`lab-aside__trigger${open ? " is-open" : ""}`}
                aria-expanded={open}
                onClick={() => onToggle(id)}
            >
                <span className="lab-aside__trigger-main">
                    {Icon ? (
                        <span className="nav-link-icon">
                            <Icon />
                        </span>
                    ) : null}
                    <span className="nav-link-text lab-aside__nav-text">{title}</span>
                </span>
                <span className="lab-aside__chev">▸</span>
            </button>
            {open ? <ul className="lab-aside__sub">{children}</ul> : null}
        </li>
    );
}

function Aside() {
    const location = useLocation();
    const { openPanel } = usePanel();
    const { asideCollapsed, toggleAsideCollapsed } = useAsideLayout();
    const [expanded, setExpanded] = useState(() => ({
        inventory: false,
        projects: false,
        management: false,
    }));

    const syncExpanded = useCallback((pathname) => {
        setExpanded((prev) => {
            const next = { ...prev };
            if (pathname.startsWith("/inventory")) next.inventory = true;
            if (pathname.startsWith("/projects")) next.projects = true;
            if (pathname.startsWith("/management")) next.management = true;
            return next;
        });
    }, []);

    useEffect(() => {
        syncExpanded(location.pathname);
    }, [location.pathname, syncExpanded]);

    const toggle = useCallback((id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    const asideClass = useMemo(() => `lab-aside${asideCollapsed ? " lab-aside--collapsed" : ""}`, [asideCollapsed]);

    return (
        <aside className={asideClass}>
            <nav className="navbar-vertical navbar navbar-expand-lg" aria-label="Основная навигация">
                <div className="lab-aside__inner w-100 d-flex flex-column">
                    <div className="lab-aside__scroll vertical-nav-scroll py-3 pe-3">
                        <h6 className="lab-aside__section-label navbar-heading text-secondary">Main</h6>
                        <ul className="lab-aside__list navbar-nav flex-column">
                            <li className="mb-1 ps-2">
                                <NavLink to="/" end className={topLinkClass}>
                                    <span className="lab-aside__trigger-main">
                                        <span className="nav-link-icon">
                                            <IoHome />
                                        </span>
                                        <span className="nav-link-text lab-aside__nav-text">Dashboard</span>
                                    </span>
                                </NavLink>
                            </li>

                            <NavGroup id="inventory" title="Inventory" icon={BsBoxes} expanded={expanded} onToggle={toggle}>
                                <li>
                                    <NavLink to="/inventory/overview" className={subLinkClass}>
                                        Overview
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/inventory/warehouses" className={subLinkClass}>
                                        Warehouses
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/inventory/storage-units" className={subLinkClass}>
                                        Storage units
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/inventory/ladder" className={subLinkClass}>
                                        Storage tree
                                    </NavLink>
                                </li>
                            </NavGroup>

                            <NavGroup id="projects" title="Projects" icon={FaRegFolderClosed} expanded={expanded} onToggle={toggle}>
                                <li>
                                    <NavLink to="/projects" end className={subLinkClass}>
                                        Overview
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/projects/research-list" className={subLinkClass}>
                                        Researches
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/projects/research-create" className={subLinkClass}>
                                        New research
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/projects/task-list" className={subLinkClass}>
                                        Tasks
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/projects/task-create" className={subLinkClass}>
                                        New task
                                    </NavLink>
                                </li>
                            </NavGroup>

                            <li className="mb-1 ps-2">
                                <NavLink to="/equipment" className={topLinkClass}>
                                    <span className="lab-aside__trigger-main">
                                        <span className="nav-link-icon">
                                            <FaFlask />
                                        </span>
                                        <span className="nav-link-text lab-aside__nav-text">Equipment</span>
                                    </span>
                                </NavLink>
                            </li>

                            <li className="mb-1 ps-2">
                                <NavLink to="/teams/participants" className={topLinkClass}>
                                    <span className="lab-aside__trigger-main">
                                        <span className="nav-link-icon">
                                            <GrGroup />
                                        </span>
                                        <span className="nav-link-text lab-aside__nav-text">Teams</span>
                                    </span>
                                </NavLink>
                            </li>
                        </ul>

                        <h6 className="lab-aside__section-label navbar-heading text-secondary">Management</h6>
                        <ul className="lab-aside__list navbar-nav flex-column">
                            <NavGroup id="management" title="Management" icon={IoGameController} expanded={expanded} onToggle={toggle}>
                                <li>
                                    <NavLink to="/management/signin" className={subLinkClass}>
                                        Sign in
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/management/signup" className={subLinkClass}>
                                        Sign up
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/management/signout" className={subLinkClass}>
                                        Sign out
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/management/userlog" className={subLinkClass}>
                                        User log
                                    </NavLink>
                                </li>
                            </NavGroup>
                        </ul>

                        <h6 className="lab-aside__section-label navbar-heading text-secondary">Panels</h6>
                        <ul className="lab-aside__list navbar-nav flex-column">
                            <li className="mb-1 ps-2">
                                <button type="button" className="lab-aside__trigger w-100 border-0 bg-transparent" onClick={() => openPanel("account")}>
                                    <span className="lab-aside__trigger-main">
                                        <span className="nav-link-icon">
                                            <FaRegUserCircle />
                                        </span>
                                        <span className="nav-link-text lab-aside__nav-text">Account</span>
                                    </span>
                                </button>
                            </li>
                            <li className="mb-1 ps-2">
                                <button type="button" className="lab-aside__trigger w-100 border-0 bg-transparent" onClick={() => openPanel("settings")}>
                                    <span className="lab-aside__trigger-main">
                                        <span className="nav-link-icon">
                                            <IoSettingsOutline />
                                        </span>
                                        <span className="nav-link-text lab-aside__nav-text">Settings</span>
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="navbar-vertical-footer">
                        <button
                            type="button"
                            className="lab-aside__rail-toggle navbar-vertical-toggle fw-semibold white-space-nowrap"
                            onClick={toggleAsideCollapsed}
                            aria-pressed={asideCollapsed}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mb-1" aria-hidden>
                                <path d="M21,11H9.41l2.3-2.29a1,1,0,1,0-1.42-1.42l-4,4a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l4,4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H21a1,1,0,0,0,0-2ZM3,3A1,1,0,0,0,2,4V20a1,1,0,0,0,2,0V4A1,1,0,0,0,3,3Z" />
                            </svg>
                            <span>{asideCollapsed ? "Expand" : "Compact sidebar"}</span>
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
}

export default Aside;
