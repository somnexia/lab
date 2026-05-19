import React from "react";
import { useLocation } from "react-router-dom";
import { getLabEquipmentMeta } from "./labEquipmentSections";

function LabEquipmentPlaceholder() {
    const { pathname } = useLocation();
    const meta = getLabEquipmentMeta(pathname);

    if (!meta) {
        return (
            <div className="container-fluid py-4">
                <h1 className="h3 mb-2">Laboratory equipment</h1>
                <p className="text-body-secondary mb-0">Choose a section from the sidebar.</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <h1 className="h3 mb-2">{meta.title}</h1>
            <p className="text-body-secondary mb-3">{meta.hint}</p>
            <div className="alert alert-secondary mb-0" role="status">
                Equipment module shell is ready — this workflow will be implemented next.
            </div>
        </div>
    );
}

export default LabEquipmentPlaceholder;
