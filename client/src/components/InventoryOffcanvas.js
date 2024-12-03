import React from "react";

const InventoryOffcanvas = ({ isLoading, inventories, storageUnit, onClose }) => {
    return (
        <div className="offcanvas  inventory-offcanvas offcanvas-end " id="offcanvasInventory"
            tabIndex="-1" aria-labelledby="offcanvasInventoryLabel"
            style={{ visibility: storageUnit ? 'visible' : 'hidden' }}>
            <div className="p-2 ">
                <div className="offcanvas-header">
                    {/* <h5 className="offcanvas-title" id="offcanvasInventoryLabel">
                        <span>{storageUnit?.unit_name || 'Неизвестный блок'}</span>
                    </h5> */}




                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {isLoading ? (
                        <p>Загрузка...</p>
                    ) : inventories.length === 0 ? (
                        <p>Инвентарь отсутствует</p>
                    ) : (


                        <div className="card  card-inventory bg-body-emphasis text-bg-dark border-0 ">
                            <div class="card-header pt-3 border-0">
                                <h5 class="card-header-title">{storageUnit?.unit_name || 'Неизвестный блок'}</h5>
                            </div>

                            <div className="card-body ">
                                <div className="table-responsive">
                                    <table className="table bg-body-emphasis table-dark table-striped table-hover table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Название</th>
                                                <th>Тип</th>
                                                <th>Количество</th>
                                                <th>Единица измерения</th>
                                                <th>Дата поступления</th>
                                                <th>Дата истечения</th>
                                                <th>Поставщик</th>
                                                <th>Статус</th>
                                                <th>Описание</th>
                                                <th>Меры безопасности</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventories.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.item_name || 'Не указано'}</td>
                                                    <td>{item.item_type || 'Не указано'}</td>
                                                    <td>{item.total_quantity || (item.substance_quantity ? `${item.substance_quantity} ${item.unit_measure}` : 'N/A')}</td>
                                                    <td>{item.unit_measure || 'N/A'}</td>
                                                    <td>{item.receipt_date ? new Date(item.receipt_date).toLocaleDateString() : 'N/A'}</td>
                                                    <td>{item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}</td>
                                                    <td>{item.supplier || 'Не указано'}</td>
                                                    <td>{item.status || 'Не указано'}</td>
                                                    <td>{item.description || 'Не указано'}</td>
                                                    <td>{item.safety_info || 'Не указано'}</td>
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
        </div>
    );
};

export default InventoryOffcanvas;

