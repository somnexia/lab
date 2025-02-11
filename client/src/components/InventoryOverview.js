import React, { Component } from 'react';
import axios from 'axios';
import InventoryDetailsModal from "./InventoryDetailsModal";
import { CartContext } from "../context/CartContext";

class InventoryOverview extends Component {
    static contextType = CartContext;
    state = {
        inventories: [],
        selectedInventory: null,
        relatedData: [],
        loading: false,
        modalLoading: false,
        error: null,
        isModalOpen: false,
    };

    componentDidMount() {
        this.fetchInventories();
    }

    fetchInventories = async () => {
        try {
            this.setState({ loading: true, error: null });
            const response = await axios.get('http://localhost:3000/api/inventories');
            this.setState({ inventories: response.data, loading: false });
        } catch (error) {
            console.error('Ошибка при загрузке данных Inventory:', error);
            this.setState({ error: 'Не удалось загрузить данные', loading: false });
        }
    };
    handleAddToCart = (inventory) => {
        const { addToCart } = this.context;
        addToCart(inventory); // Добавляем инвентарь в корзину через контекст
    };




    openModal = async (inventory) => {
        try {
            this.setState({
                selectedInventory: inventory,
                isModalOpen: true,
                modalLoading: true,
                error: null,
            });
            // console.log('Данные inventory:', inventory);

            // Запрос связанных данных по reference_id и item_type
            const inventoryResponse = await axios.get('http://localhost:3000/api/inventories/filter', {
                params: {
                    reference_id: inventory.reference_id,
                    item_type: inventory.item_type,
                },
            });

            const inventoryData = inventoryResponse.data[0] || {};

            // Запрос цепочки расположений
            if (!inventoryData.storageUnits || inventoryData.storageUnits.length === 0) {
                throw new Error('Данные о storageUnits отсутствуют');
            }

            // Берем первый storageUnit (или другой по логике)
            const storageUnit = inventoryData.storageUnits[0];
            // console.log("storageUnit:", storageUnit)
            const storageUnitId = storageUnit.id; // Извлекаем нужный id
            // console.log("storageUnitId:", storageUnitId)

            // Запрос цепочки расположений по storageUnitId
            const locationChainResponse = await axios.get(
                `http://localhost:3000/api/storageunits/${storageUnitId}/location-chain`
            );

            // const llocation = inventoryData.storageUnits && inventoryData.storageUnits.length > 0
            // ? inventoryData.storageUnits.map(unit => unit.unit_name).join(' > ') 
            // : 'Не указано';

            // console.log('inventoryData.storageUnits:', inventoryData.storageUnits);
            // console.log('llocation:', llocation);

            const locationChain = locationChainResponse.data || [];
            console.log('Данные locationChain:', locationChain);

            const location = locationChain && locationChain.length > 0
                ? locationChain.map(unit => unit.name).join(' > ') : 'Не указано';

            // const buildLocationString = (locationChain) =>
            //     locationChain && locationChain.length > 0
            //         ? locationChain.map(unit => unit.name).join(' > ')
            //         : 'Не  указано';


            console.log('Данные location:', location);

            const fullInventory = {
                ...inventory,
                chemCompound: inventoryData.chemCompound || null,
                chemEquipment: inventoryData.chemEquipment || null,
                chemElement: inventoryData.chemElement || null,
                chemMixture: inventoryData.chemMixture || null,
                storageUnits: inventoryData.storageUnits || [],
                location,
                locationChain, // Добавляем цепочку расположений
            };

            // console.log('Данные inventoryData:', inventoryData);

            console.log('Объект, передаваемый в InventoryDetailsModal:', fullInventory);

            this.setState({
                selectedInventory: fullInventory,
                modalLoading: false,
            });
        } catch (error) {
            console.error('Ошибка при загрузке связанных данных:', error);
            this.setState({ error: 'Не удалось загрузить связанные данные', modalLoading: false });
        }
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            selectedInventory: null,
            relatedData: [],
        });
    };

    render() {
        const {
            inventories,
            selectedInventory,
            loading,
            modalLoading,
            error,
            isModalOpen,
        } = this.state;
 
        const { addToCart } = this.context;
        return (
            <div>
                <div className="row g-3">
                    <div className="card border-0 h-100">
                        <div className="card-header pt-3 border-0">
                            <h3 className="card-header-title">Inventory List</h3>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Reference ID</th>
                                            <th>Total Quantity</th>
                                            <th>Substance Amount</th>
                                            <th>Unit Measure</th>
                                            <th>Status</th>
                                            <th>Receipt Date</th>
                                            <th>Expiration Date</th>
                                            <th>Supplier</th>
                                            <th>Latest update</th>
                                            <th>Description</th>
                                            <th>Safety Information</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && (
                                            <tr>
                                                <td colSpan="14" style={{ textAlign: 'center' }}>
                                                    Загрузка...
                                                </td>
                                            </tr>
                                        )}
                                        {error && (
                                            <tr>
                                                <td colSpan="14" style={{ textAlign: 'center', color: 'red' }}>
                                                    {error}
                                                </td>
                                            </tr>
                                        )}
                                        {inventories.length > 0 ? (
                                            inventories.map((inventory) => (
                                                <tr key={inventory.id}>
                                                    <td>{inventory.id}</td>
                                                    <td>
                                                        <a
                                                            className="btn btn-link text-decoration-none " role="button"
                                                            onClick={() => this.openModal(inventory)}
                                                        >
                                                            {inventory.item_name || 'Название отсутствует'}
                                                        </a>
                                                    </td>
                                                    <td>{inventory.item_type}</td>
                                                    <td>{inventory.reference_id}</td>
                                                    <td>{inventory.total_quantity}</td>
                                                    <td>{inventory.substance_amount || 'N/A'}</td>
                                                    <td>{inventory.unit_measure || 'N/A'}</td>
                                                    <td>{inventory.status}</td>
                                                    <td>{inventory.receipt_date}</td>
                                                    <td>{inventory.expiration_date || 'N/A'}</td>
                                                    <td>{inventory.supplier || 'N/A'}</td>
                                                    <td>{inventory.last_updated}</td>
                                                    <td>{inventory.description || 'N/A'}</td>
                                                    <td>{inventory.safety_info || 'N/A'}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => this.handleAddToCart(inventory)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="14" style={{ textAlign: 'center' }}>
                                                    Inventory not found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedInventory && (
                    <InventoryDetailsModal
                        isOpen={isModalOpen}
                        inventory={selectedInventory}
                        onClose={this.closeModal}
                        loading={modalLoading}
                        error={error}
                        addToCart={addToCart} // Передаем метод addToCart в модальное окно
                    />
                )}
            </div>
        );
    }
}

export default InventoryOverview;
