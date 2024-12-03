import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryOffcanvas from './InventoryOffcanvas';

const StorageUnitList = () => {
    const [storageUnits, setStorageUnits] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState([]);
    const [selectedStorageUnit, setSelectedStorageUnit] = useState(null);
    const [loadingInventory, setLoadingInventory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка блоков хранения
    useEffect(() => {
        const fetchStorageUnits = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/storageUnits');
                setStorageUnits(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке блоков хранения:', error);
                setError('Ошибка при загрузке единиц хранения');
            } finally {
                setLoading(false);
            }
        };

        fetchStorageUnits();
    }, []);

    // Загрузка инвентаря
    const fetchInventory = async (storageUnitId) => {
        setLoadingInventory(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/storageUnits/${storageUnitId}/inventories`
            );
            setSelectedInventory(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке инвентаря:', error);
            setSelectedInventory([]);
        } finally {
            setLoadingInventory(false);
        }
    };

    // Открытие offcanvas
    const handleOpenOffcanvas = (storageUnit) => {
        setSelectedStorageUnit(storageUnit);
        fetchInventory(storageUnit.id);
    };

    // Закрытие offcanvas
    const handleCloseOffcanvas = () => {
        setSelectedStorageUnit(null);
        setSelectedInventory([]);
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <div className="row g-3">
                <div className="card bg-body-emphasis text-bg-dark border-0 h-100">
                    <div className="card-header pt-3 border-0">
                        <h3 className="card-header-title">Storage Units</h3>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive ">
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
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasInventory"
                                                    aria-controls="offcanvasInventory"
                                                    onClick={() => handleOpenOffcanvas(unit)}
                                                >
                                                    {unit.unit_name || 'Unnamed'}
                                                </a>
                                            </td>
                                            <td>{unit.unit_type}</td>
                                            <td>{unit.capacity || 'N/A'}</td>
                                            <td>{unit.current_utilization || 'N/A'}</td>
                                            <td>{unit.temperature || 'N/A'}</td>
                                            <td>{unit.humidity || 'N/A'}</td>
                                            <td>{unit.pressure || 'N/A'}</td>
                                            <td>{unit.material || 'N/A'}</td>
                                            <td>{unit.safety_rating || 'N/A'}</td>
                                            <td>{unit.last_maintenance_date || 'N/A'}</td>
                                            <td>{unit.next_maintenance_date || 'N/A'}</td>
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
                onClose={handleCloseOffcanvas}
            />
        </>
    );
};

export default StorageUnitList;
