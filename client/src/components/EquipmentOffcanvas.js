import React, { Component } from "react";
import axios from 'axios';
import { CartContext } from "../context/CartContext";

class EquipmentOffcanvas extends Component {
    static contextType = CartContext;
    constructor(props) {
        super(props);
        this.state = {
            storageUnits: [], // Данные о местах хранения
            inventoryDetails: null, // Подробности инвентаря
            loading: true, // Индикатор загрузки
            error: null, // Ошибка при загрузке данных
        };
    }

    async fetchStorageUnits() {
        const { selectedEquipment } = this.props;
        if (!selectedEquipment) return;

        try {
            this.setState({ loading: true });
            const response = await axios.get(`http://localhost:3000/api/chemEquipments/${selectedEquipment.id}/locations`);

            const inventories = response.data.inventories || [];
            const storageUnits = inventories.flatMap((inventory) =>
                (inventory.storageUnits || []).map((unit) => ({
                    ...unit,
                    ...inventory,
                    location: this.generateLocationChain(unit),

                    // отдельные поля
                    // item_name: inventory.item_name, 
                    // total_quantity: inventory.total_quantity,
                    // supplier: inventory.supplier, 
                }))

            );
            console.log("inventories:", inventories);



            this.setState({ storageUnits, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }
    generateLocationChain(unit) {
        let currentUnit = unit;
        const locationChain = [];

        while (currentUnit) {
            locationChain.unshift(currentUnit.unit_name); // Добавляем имя в цепочку
            currentUnit = currentUnit.parent; // Переходим к родительской ячейке
        }

        return locationChain.join(" > "); // Объединяем имена через " > "
    }


    componentDidUpdate(prevProps) {
        if (this.props.selectedEquipment !== prevProps.selectedEquipment) {
            this.fetchStorageUnits();
        }
    }
    handleAddToCart = (unit) => {
        const { addToCart } = this.context;
        addToCart(unit); // Добавляем инвентарь в корзину через контекст
    };

    render() {
        const { storageUnits, loading, error, } = this.state;
        const { onClose, selectedEquipment, } = this.props;
        // const { addToCart } = this.context;

        return (
            <div
                className="offcanvas inventory-offcanvas offcanvas-end"
                id="offcanvasEquipmentDetails"
                tabIndex="-1"
                aria-labelledby="offcanvasEquipmentDetailsLabel"
                style={{ display: loading ? "none" : "block" }}>
                <div className="offcanvas-header justify-content-end">
                    {/* <div className="offcanvas-title" id="offcanvasEquipmentDetailsLabel">
                        <h4>{selectedEquipment ? selectedEquipment.name : "Equipment Details"}</h4>
                    </div> */}
                    <div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
                <div className="offcanvas-body">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-danger">Error: {error}</div>
                    ) : storageUnits.length === 0 ? (
                        <h3 className="text-white">Currently no inventory in storage</h3>

                    ) : (
                        <div className="card  card-inventory bg-body-emphasis text-bg-dark border-0 ">
                            <div className="card-header pt-3 border-0">
                                <h5 className="card-header-title">{selectedEquipment ? selectedEquipment.name : "Equipment Details"}</h5>
                            </div>

                            <div className="card-body ">
                                <div className="table-responsive">
                                    <table className="table table-dark table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Item ID</th>
                                                <th>Item Name</th>
                                                <th>Supplier</th>
                                                <th>description</th>
                                                <th>Storage Unit ID</th>
                                                <th>Unit Name</th>
                                                <th>Location</th>
                                                <th>Quantity In Unit</th>
                                                <th>Storage ID</th>
                                                <th>Status</th>
                                                <th>Actions</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {storageUnits.map((unit, index) => (
                                                <tr key={`${unit.id}-${index}`}>

                                                    <td>{unit.id || "N/A"}</td>
                                                    <td>{unit.item_name || "N/A"}</td>
                                                    <td>{unit.supplier || "N/A"}</td>
                                                    <td>{unit.description || "N/A"}</td>
                                                    <td>{unit.InventoryStorageUnit?.storageunit_id || "N/A"}</td>
                                                    <td>{unit.unit_name || "N/A"}</td>
                                                    <td>{unit.location || "N/A"}</td>
                                                    <td>{unit.InventoryStorageUnit?.quantity || "N/A"}</td>
                                                    <td>{unit.storage_id}</td>
                                                    <td>{unit.status || "N/A"}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => this.handleAddToCart(unit)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </td>

                                                </tr>

                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default EquipmentOffcanvas;
