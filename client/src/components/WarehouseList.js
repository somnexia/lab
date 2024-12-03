import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WarehouseChart from './WarehouseChart';

const WarehouseList = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка списка складов
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/storages');
                setWarehouses(response.data);
            } catch (error) {
                setError('Ошибка при загрузке складов');
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouses();
    }, []);

    // Удаление склада
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/storages/${id}`);
            setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
        } catch (error) {
            alert('Ошибка при удалении склада');
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className='row g-5'>
            <div className="card bg-body-emphasis text-bg-dark border-0 h-100">
                <div className='card-header pt-3 border-0'>
                    <h3 className="card-header-title  ">Available Warehouses</h3>

                </div>
                <div className='card-body'>
                    <div className='table-responsive-xxl'>
                        <table className="table table-dark table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Capacity</th>
                                    <th scope="col">Utilization</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warehouses.map((warehouse, index) => (
                                    <tr key={warehouse.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{warehouse.storage_name}</td>
                                        <td>{warehouse.storage_type}</td>
                                        <td>{warehouse.capacity}</td>
                                        <td>{warehouse.current_utilization}</td>
                                        <td>{warehouse.description || 'Нет описания'}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(warehouse.id)}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
            <div className='h-100 text-bg-dark card bg-body-emphasis '>
                <div className='card-body'>
                    
                    <WarehouseChart warehouses={warehouses || []} />

               
                </div>
            

                

            </div>
            
        </div>




    );
};

export default WarehouseList;
