import React, { Component } from "react";
import axios from "axios";
import InventoryOffcanvas from "./InventoryOffcanvas";

class StorageUnitList extends Component {
    state = {
        storageUnits: [],
        selectedInventory: [],
        selectedStorageUnit: null,
        loadingInventory: false,
        loading: true,
        error: null,
    };

    // Загрузка блоков хранения при монтировании компонента
    componentDidMount() {
        this.fetchStorageUnits();
    }

    fetchStorageUnits = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/storageUnits");
            this.setState({ storageUnits: response.data, loading: false });
        } catch (error) {
            console.error("Ошибка при загрузке блоков хранения:", error);
            this.setState({ error: "Ошибка при загрузке единиц хранения", loading: false });
        }
    };

    fetchInventory = async (storageUnitId) => {
        this.setState({ loadingInventory: true });
        try {
            const response = await axios.get(
                `http://localhost:3000/api/inventoryStorageUnit/${storageUnitId}/inventories`
            );
            this.setState({ selectedInventory: response.data });
        } catch (error) {
            console.error("Ошибка при загрузке инвентаря:", error);
            this.setState({ selectedInventory: [] });
        } finally {
            this.setState({ loadingInventory: false });
        }
    };

    handleOffcanvasOpen = (offcanvasId,storageUnit) => {
        const offcanvasElement = document.getElementById(offcanvasId);
        if (offcanvasElement) {
            const bootstrap = require("bootstrap");
            const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
            offcanvasInstance.show();
        }
        this.setState({ selectedStorageUnit: storageUnit });
        this.fetchInventory(storageUnit.id);
    };
        // handleOpenOffcanvas = (storageUnit) => {
        //     this.setState({ selectedStorageUnit: storageUnit });
        //     this.fetchInventory(storageUnit.id);
        // };

    handleCloseOffcanvas = () => {
        this.setState({ selectedStorageUnit: null, selectedInventory: [] });
    };

    render() {
        const {
            storageUnits,
            selectedInventory,
            selectedStorageUnit,
            loadingInventory,
            loading,
            error,
        } = this.state;

        if (loading) return <p>Загрузка...</p>;
        if (error) return <p style={{ color: "red" }}>{error}</p>;

        return (
            <>
                <div className="row g-3">
                    <div className="card bg-body-emphasis text-bg-dark border-0 h-100">
                        <div className="card-header pt-3 border-0">
                            <h3 className="card-header-title">Storage Units</h3>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table bg-body-emphasis table-dark table-striped table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Capacity</th>
                                            <th>Utilization</th>
                                            <th>Temperature</th>
                                            <th>Humidity</th>
                                            <th>Pressure</th>
                                            <th>Material</th>
                                            <th>Safety Rating</th>
                                            <th>Last Maintenance</th>
                                            <th>Next Maintenance</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storageUnits.map((unit, index) => (
                                            <tr key={unit.id}>
                                                <th>{index + 1}</th>
                                                <td>
                                                    <a
                                                        className="btn btn-link text-decoration-none text-light"
                                                        role="button"
                                                        onClick={() => this.handleOffcanvasOpen("offcanvasInventory",unit)}
                                                    >
                                                        {unit.unit_name || "Unnamed"}
                                                    </a>
                                                </td>
                                                <td>{unit.unit_type}</td>
                                                <td>{unit.capacity || "N/A"}</td>
                                                <td>{unit.current_utilization || "N/A"}</td>
                                                <td>{unit.temperature || "N/A"}</td>
                                                <td>{unit.humidity || "N/A"}</td>
                                                <td>{unit.pressure || "N/A"}</td>
                                                <td>{unit.material || "N/A"}</td>
                                                <td>{unit.safety_rating || "N/A"}</td>
                                                <td>{unit.last_maintenance_date || "N/A"}</td>
                                                <td>{unit.next_maintenance_date || "N/A"}</td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm">Удалить</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offcanvas для отображения инвентаря */}
                <InventoryOffcanvas
                    isLoading={loadingInventory}
                    inventories={selectedInventory}
                    storageUnit={selectedStorageUnit}
                    onClose={this.handleCloseOffcanvas}
                />
            </>
        );
    }
}

export default StorageUnitList;
