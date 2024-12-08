import React, { Component } from "react";
import axios from "axios";
import EquipmentOffcanvas from "./EquipmentOffcanvas";


class EquipmentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            equipmentData: [],
            isLoading: false,
            error: null,
            isOffcanvasOpen: false, // Отслеживает состояние Offcanvas
            selectedEquipment: null, // Содержит данные выбранного оборудования

        };
    };


    // Функция для загрузки данных
    fetchData = async () => {
        const { category, group } = this.props;
        console.log("Fetching data with category:", category, "and group:", group);

        this.setState({ isLoading: true });

        try {
            let url = `http://localhost:3000/api/ChemEquipments/equipments?category=${category}`;
            const response = await axios.get(url);

            // Фильтруем данные по группе, если группа указана
            const filteredData = group
                ? response.data.filter((item) => item.group === group)
                : response.data;

            console.log("Filtered data:", filteredData);

            const transformedData = response.data.map((item) => ({
                ...item,
                location: item.inventories?.[0]?.storage_id || 'N/A', // Берем первое местоположение, если есть
            }));

            this.setState({ equipmentData: filteredData, transformedData, isLoading: false });
        } catch (error) {
            console.error("Ошибка при получении данных оборудования:", error);
            this.setState({ error: "Failed to load data", isLoading: false });
        }
    };


    // Используем componentDidUpdate для того, чтобы перезапрашивать данные при изменении категории или группы
    componentDidUpdate(prevProps) {
        const { category, group } = this.props;
        if (category && (category !== prevProps.category || group !== prevProps.group)) {
            console.log("Fetching data for:", category, group);
            this.fetchData();
        };
    };

    // Обработчик для добавления оборудования в корзину
    handleAddToCart = (equipment) => {
        this.props.onAddToCart(equipment); // Передаем оборудование в родительский компонент
    };
    handleOffcanvasOpen = (offcanvasId,equipment) => {
        const offcanvasElement = document.getElementById(offcanvasId);
        if (offcanvasElement) {
            const bootstrap = require("bootstrap");
            const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
            offcanvasInstance.show();
        }
        this.setState({
            isOffcanvasOpen: true,
            selectedEquipment: equipment,
        });
    };



    handleCloseOffcanvas = () => {
        this.setState({
            isOffcanvasOpen: false,
            selectedEquipment: null,
        });
    };

    render() {
        const { equipmentData, isLoading, error, isOffcanvasOpen, selectedEquipment } = this.state;

        return (
            <div>
                <div className="card-body">
                    {isLoading && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                    <div className="table-responsive-xxl">
                        <table className="table table-dark table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Unique Number</th>
                                    <th>Category</th>
                                    <th>Group</th>
                                    <th>Location</th>
                                    <th>Manufacturer</th>
                                    <th>Model</th>
                                    <th>Material</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">Loading equipment data...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="9">{error}</td>
                                    </tr>
                                ) : equipmentData.length > 0 ? (
                                    equipmentData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>
                                                <a
                                                    className="btn btn-link text-decoration-none text-light"
                                                    role="button"
                                                    onClick={() => this.handleOffcanvasOpen("offcanvasEquipmentDetails",item)}>
                                                    {item.name}
                                                </a>
                                            </td>
                                            <td>{item.unique_id}</td>
                                            <td>{item.category}</td>
                                            <td>{item.group}</td>
                                            <td>{item.location}</td>
                                            <td>{item.manufacturer}</td>
                                            <td>{item.model}</td>
                                            <td>{item.material}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => this.handleAddToCart(item)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No equipment found for the selected filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
                <EquipmentOffcanvas
                    isOffcanvasOpen={isOffcanvasOpen}
                    selectedEquipment={selectedEquipment}
                    onClose={this.handleCloseOffcanvas}
                />
            </div >
        );
    };
};


export default EquipmentTable;
