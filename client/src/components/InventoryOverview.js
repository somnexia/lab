import React, { Component } from 'react';
import axios from 'axios';
import InventoryDetailsModal from "./InventoryDetailsModal";
import InventoryTable from "./InventoryTable";
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
        const isFullPage = Boolean(this.props.fullPage);

        return (
            <div className={isFullPage ? "inventory-overview inventory-overview--full" : "inventory-overview"}>
                <InventoryTable
                    compact={!isFullPage}
                    error={error}
                    fullViewLink={isFullPage ? null : "/inventory/list"}
                    inventories={inventories}
                    loading={loading}
                    maxRows={isFullPage ? null : 6}
                    onAddToCart={this.handleAddToCart}
                    onOpenDetails={this.openModal}
                    sectionDescription={
                        isFullPage
                            ? "A complete inventory table with item references, quantities, statuses and storage details."
                            : "A short preview of recent inventory records. Open the full table for all fields and more rows."
                    }
                    sectionTitle={isFullPage ? "All Inventory" : "Inventory List"}
                />
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
