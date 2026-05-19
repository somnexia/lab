import React from "react";
import { useLocation } from "react-router-dom";
import { getInventoryMaterialsMeta } from "./inventorySections";

function InventoryMaterialsPlaceholder() {
    const { pathname } = useLocation();
    const meta = getInventoryMaterialsMeta(pathname);

    if (!meta) {
        return (
            <div className="container-fluid py-4">
                <h1 className="h3 mb-2">Inventory</h1>
                <p className="text-body-secondary mb-0">Choose a materials section from the sidebar.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <h1 className="h3 mb-2">{meta.title}</h1>
            <p className="text-body-secondary mb-3">{meta.hint}</p>
            <div className="alert alert-secondary mb-0" role="status">
                Materials module shell is ready — full catalog and stock workflows will be added next.
            </div>
        </div>
    );
}

export default InventoryMaterialsPlaceholder;
