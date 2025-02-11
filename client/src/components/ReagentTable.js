import React, { Component } from 'react';
import axios from 'axios';

class ReagentTable extends Component {
    state = {
        inventories: [], // Данные модели Inventory
        selectedInventory: null, // Выбранный инвентарь для модального окна
        relatedData: [], // Связанные данные для модального окна
        loading: false, // Индикатор загрузки
        modalLoading: false, // Индикатор загрузки для модального окна
        error: null, // Ошибка
        isModalOpen: true, // Состояние модального окна
    };

    // Получение всех данных Inventory при загрузке компонента
    componentDidMount() {
        this.fetchInventories();
    }

    // Метод для получения всех данных Inventory
    fetchInventories = async () => {
        try {
            this.setState({ loading: true, error: null });
            const response = await axios.get('http://localhost:3000/api/inventories'); // Ваш маршрут для получения всех данных
            this.setState({ inventories: response.data, loading: false });
        } catch (error) {
            console.error('Ошибка при загрузке данных Inventory:', error);
            this.setState({ error: 'Не удалось загрузить данные', loading: false });
        }
    };

    // Метод для открытия модального окна и получения связанных данных
    openModal = async (inventory) => {
        try {
            this.setState({
                selectedInventory: inventory,
                isModalOpen: true,
                modalLoading: true,
                error: null,
            });

            // Запрос связанных данных по reference_id и item_type
            const response = await axios.get('http://localhost:3000/api/inventories/filter', {
                params: {
                    reference_id: inventory.reference_id,
                    item_type: inventory.item_type,
                },
            });

            this.setState({ relatedData: response.data, modalLoading: false });
        } catch (error) {
            console.error('Ошибка при загрузке связанных данных:', error);
            this.setState({ error: 'Не удалось загрузить связанные данные', modalLoading: false });
        }
    };

    // Закрытие модального окна
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
            relatedData,
            loading,
            modalLoading,
            error,
            isModalOpen,
        } = this.state;

        return (
            <div>
                <h1>Таблица инвентаря</h1>

                {/* Сообщение о загрузке или ошибке */}
                {loading && <p>Загрузка...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Таблица данных Inventory */}
                <table border="1" style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Тип</th>
                            <th>Reference ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.length > 0 ? (
                            inventories.map((inventory) => (
                                <tr key={inventory.id}>
                                    <td>{inventory.id}</td>
                                    <td>
                                        <button
                                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                            onClick={() => this.openModal(inventory)}
                                            data-bs-toggle="modal" data-bs-target="#exampleModal">                                        >
                                            {inventory.item_name || 'Название отсутствует'}
                                        </button>
                                    </td>
                                    <td>{inventory.item_type}</td>
                                    <td>{inventory.reference_id}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Нет данных
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Модальное окно */}
                {isModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#000000',
                                padding: '20px',
                                borderRadius: '5px',
                                width: '60%',
                            }}
                        >
                            <h2>Связанные данные: {selectedInventory.item_name || 'Название отсутствует'}</h2>
                            <button onClick={this.closeModal} style={{ float: 'right' }}>
                                Закрыть
                            </button>

                            {modalLoading && <p>Загрузка связанных данных...</p>}
                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            {/* Таблица связанных данных */}
                            <table border="1" style={{ width: '100%', marginTop: '20px' }}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Детали</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatedData.length > 0 ? (
                                        relatedData.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>
                                                    {item.chemElement && `Element: ${item.chemElement.name}`}
                                                    {item.chemEquipment && `Equipment: ${item.chemEquipment.name}`}
                                                    {item.chemCompound && `Compound: ${item.chemCompound.name}`}
                                                    {item.chemMixture && `Mixture: ${item.chemMixture.name}`}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" style={{ textAlign: 'center' }}>
                                                Нет данных
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ReagentTable;
