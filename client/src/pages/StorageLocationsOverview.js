import React from "react";

function StorageLocationsOverview() {
    return (
        <div className="container-fluid py-3">
            <h3 className="h5 mb-2">Storage overview</h3>
            <p className="text-body-secondary mb-3">
                Summary of warehouses, freezers, and storage units. Use the sidebar to manage structure or open the storage tree.
            </p>
            <div className="alert alert-secondary mb-0" role="status">
                Aggregated storage metrics will appear here. Open <strong>Warehouses</strong> or <strong>Storage tree</strong> to manage locations today.
            </div>
        </div>
    );
}

export default StorageLocationsOverview;
