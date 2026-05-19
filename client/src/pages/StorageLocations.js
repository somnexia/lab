import React, { Component } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    Boxes,
    Building2,
    GitBranch,
    LayoutDashboard,
    ListTree,
    MapPin,
    Network,
} from "lucide-react";

class StorageLocations extends Component {
    render() {
        const navItems = [
            {
                to: "/storage-locations/overview",
                Icon: LayoutDashboard,
                title: "Overview",
                description: "Storage sites, capacity, and unit health",
                variant: "primary",
            },
            {
                to: "/storage-locations/warehouses",
                Icon: Building2,
                title: "Warehouses",
                description: "Manage warehouse spaces",
                variant: "success",
            },
            {
                to: "/storage-locations/storage-units",
                Icon: Boxes,
                title: "Storage Units",
                description: "Browse shelves, racks and containers",
                variant: "accent",
            },
            {
                to: "/storage-locations/ladder",
                Icon: Network,
                title: "Storage Tree",
                description: "Review parent and child units",
                variant: "info",
            },
            {
                to: "/storage-locations/dropdown",
                Icon: ListTree,
                title: "Dropdown View",
                description: "Quick hierarchy selector",
                variant: "warning",
            },
            {
                to: "/storage-locations/location",
                Icon: MapPin,
                title: "Locations",
                description: "Find items by storage place",
                variant: "danger",
            },
        ];

        return (
            <div className="inventory-page">
                <section className="inventory-page__hero">
                    <div>
                        <p className="inventory-page__eyebrow">Storage workspace</p>
                        <h2 className="inventory-page__title">Storage &amp; locations</h2>
                        <p className="inventory-page__subtitle">
                            Manage where materials live: warehouses, units, hierarchies, and placement — not chemical catalogs or stock quantities.
                        </p>
                    </div>
                </section>

                <div className="row g-4 inventory-page__layout">
                    <aside className="col-12 col-xl-4 col-xxl-3">
                        <div className="inventory-page__sidebar">
                            <nav className="inventory-page__nav" aria-label="Storage sections">
                                {navItems.map(({ to, Icon, title, description, variant }) => (
                                    <NavLink
                                        className={({ isActive }) =>
                                            `inventory-page__nav-button inventory-page__nav-button--${variant}${isActive ? " active" : ""}`
                                        }
                                        key={to}
                                        to={to}
                                    >
                                        <span className="inventory-page__nav-icon">
                                            <Icon size={24} />
                                        </span>
                                        <span className="inventory-page__nav-copy">
                                            <span className="inventory-page__nav-title">{title}</span>
                                            <span className="inventory-page__nav-description">{description}</span>
                                        </span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="inventory-page__sidebar-card">
                                <span className="inventory-page__sidebar-icon">
                                    <GitBranch size={20} />
                                </span>
                                <div>
                                    <strong>Storage tree tip</strong>
                                    <p>
                                        Use colored levels to read parent and child units faster while scrolling long hierarchies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="col-12 col-xl-8 col-xxl-9">
                        <div className="inventory-page__content">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default StorageLocations;
