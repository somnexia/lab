import React, { Component } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { FaShareNodes } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import axios from 'axios';



class InventoryDetailsModal extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showMore: false, // Состояние для управления отображением дополнительных данных
            status: this.props.inventory?.status || "available"
        };
    }
    



    handleBackdropClick = (e) => {
        const { onClose } = this.props;
        // Закрываем модальное окно, если клик был на фоне (а не на содержимом модального окна)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    toggleShowMore = () => {
        this.setState((prevState) => ({ showMore: !prevState.showMore }));
    };
    handleStatusChange = async (newStatus) => {
        const { inventory } = this.props;  // Получаем текущие данные инвентаря из props
        try {
            // Отправляем запрос на сервер для обновления статуса
            const response = await axios.put(`http://localhost:3000/api/inventories/${inventory.id}`, {
                ...inventory,
                status: newStatus,  // Обновляем только статус
            });
    
            // Проверяем, что запрос успешен
            if (response.status === 200) {
                this.setState({ status: newStatus });  // Обновляем локальный статус
                alert(`Inventory status successfully changed to ${newStatus}`);
            }
        } catch (error) {
            console.error("Ошибка при изменении статуса:", error);
            alert("Could not change status. Please try again.");
        }
    };
    
    render() {
        const {
            isOpen,
            inventory,
            relatedData,
            onClose,
            loading,
            error,
            addToCart,
        } = this.props;
        const { showMore } = this.state;
        const { status } = this.state;

        if (!isOpen) return null;

        return (
            <div
                className="modal fade lab-modal-backdrop p-0 show"
                id="inventoryDetailsModal"
                role="dialog"
                tabIndex={-1}
                aria-describedby="inventoryDetailsModalDescription"
                aria-labelledby="inventoryDetailsModalLabel"
                style={{ display: isOpen ? 'block' : 'none' }}
                aria-hidden={!isOpen}
                aria-modal="true"
                onClick={this.handleBackdropClick} // Обработка клика на фон
            >
                <div className="modal-dialog  modal-xl" onClick={(e) => e.stopPropagation()} >
                    <div className="modal-content">
                        <div className="modal-header position-relative p-0">
                            <button
                                onClick={onClose}
                                type="button"
                                className="btn-close position-absolute end-0 top-0 mt-3 me-3"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                            <img
                                src="/images/43.824783eab918239b78da.png"
                                alt="cover"
                                className="w-100"
                                style={{ minHeight: "150px", maxHeight: "280px" }}
                            ></img>
                        </div>
                        <div className="modal-body">

                            {loading && <p>Загрузка связанных данных...</p>}

                            <div className='row gap-3'>
                                <div className='col-xl-10 col-12'>
                                    <div className='mb-4'>
                                        <h3 className='mb-3 lab-text-primary'>{inventory?.item_name || "Название отсутствует"}</h3>
                                        <h5 className=''>
                                            <strong>Location:</strong> {inventory?.location || "Информация отсутствует"}</h5>
                                        {error && <p style={{ color: "red" }}>{error}</p>}
                                    </div>
                                    {/* Таблица с данными инвентаря */}
                                    <div className="table-responsive border-1 mb-3">
                                        <table className="table table-striped table-bordered" border="1" style={{ width: "100%", marginTop: "20px" }}>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Item Name</th>
                                                    <th>item_type</th>
                                                    <th>substance_amount</th>
                                                    <th>unit_measure</th>
                                                    <th>receipt_date</th>
                                                    <th>expiration_date</th>
                                                    <th>supplier</th>
                                                    <th>status</th>
                                                   
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventory ? (
                                                    <tr>
                                                        <td>{inventory.id}</td>
                                                        <td>{inventory.item_name}</td>
                                                        <td>{inventory.item_type}</td>
                                                        <td>{inventory.substance_amount}</td>
                                                        <th>{inventory.unit_measure}</th>
                                                        <th>{inventory.receipt_date}</th>
                                                        <th>{inventory.receipt_date}</th>
                                                        <th>{inventory.supplier}</th>
                                                        {/* <th>{inventory.last_updated}</th> */}
                                                        <th className={`text-bg-${inventory.status === 'available' ? 'success' : 'danger'}`} > <span >
                                                            {inventory.status}
                                                        </span></th>
                                                        {/* <th>{inventory.description}</th>
                                            <th>{inventory.safety_info}</th> */}
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2">Нет данных</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Данные chemCompound, chemEquipment, chemElement, chemMixture */}
                                    {inventory.chemCompound && (
                                        <div className="card mb-3">
                                            <div className="card-header">Chemical Compound</div>
                                            <div className="card-body">
                                                <p><strong>CAS Number:</strong> {inventory.chemCompound.cas_id}</p>
                                                <p><strong>Collection Name:</strong> {inventory.chemCompound.name}</p>
                                                <p><strong>Formula:</strong> {inventory.chemCompound.formula}</p>
                                                <p><strong>Molecular Weight:</strong> {inventory.chemCompound.molecular_weight}</p>
                                                <p><strong>Aggregate State:</strong> {inventory.chemCompound.aggregate_state}</p>
                                            </div>
                                        </div>
                                    )}

                                    {inventory.chemEquipment && (
                                        <div className="card mb-3">
                                            <div className="card-header">Chemical Equipment</div>
                                            <div className="card-body">
                                                <p><strong>Unique Number:</strong> {inventory.chemEquipment.unique_id}</p>
                                                <p><strong>Collection Name:</strong> {inventory.chemEquipment.name}</p>
                                                <p><strong>Category:</strong> {inventory.chemEquipment.name}</p>
                                                <p><strong>Group:</strong> {inventory.chemEquipment.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {inventory.chemElement && (
                                        <div className="card mb-3">
                                            <div className="card-header">Chemical Element</div>
                                            <div className="card-body">
                                                <p><strong>CAS Number:</strong> {inventory.chemElement.cas_id}</p>
                                                <p><strong>Collection Name:</strong> {inventory.chemElement.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {inventory.chemMixture && (
                                        <div className="card mb-3">
                                            <div className="card-header">Chemical Mixture</div>
                                            <div className="card-body">
                                                <p><strong>CAS Number:</strong> {inventory.chemMixture.cas_id}</p>
                                                <p><strong>Collection Name:</strong> {inventory.chemMixture.name}</p>
                                            </div>
                                        </div>
                                    )}


                                    {inventory.storageUnits && inventory.storageUnits.length > 0 && (
                                        <div className="accordion" id="storageUnitsAccordion">
                                            {inventory.storageUnits.map((unit, index) => (
                                                <div className="accordion-item" key={unit.id}>
                                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapse-${index}`}
                                                            aria-expanded="false"
                                                            aria-controls={`collapse-${index}`}
                                                        >
                                                            Storage Unit: {unit.unit_name}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse-${index}`}
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby={`heading-${index}`}
                                                        data-bs-parent="#storageUnitsAccordion"
                                                    >
                                                        <div className="accordion-body">
                                                            <p><strong>ID:</strong> {unit.id}</p>
                                                            <p><strong>Capacity:</strong> {unit.capacity}</p>
                                                            <p><strong>Current Utilization:</strong> {unit.current_utilization}</p>
                                                            <p><strong>Temperature:</strong> {unit.temperature}</p>
                                                            <p><strong>Humidity:</strong> {unit.humidity}</p>
                                                            <p><strong>Pressure:</strong> {unit.pressure}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showMore && (
                                        <div className="card mt-4 shadow-sm">
                                            <div className="card-header bg-body-emphasis text-white">
                                                <h6 className="mb-0">Inventory Details</h6>
                                            </div>
                                            <div className="card-body bg-body-emphasis">

                                                <p><strong>Discription:</strong> {inventory?.description}</p>
                                                <p><strong>Safety Info:</strong> {inventory?.safety_info}</p>



                                                {/* Пример: Добавить другие секции
                                            <div className="related-data">
                                                <h6>Chemical Compound</h6>
                                                {inventory?.chemCompound ? (
                                                    <p>{inventory.chemCompound.formula || 'No data'}</p>
                                                ) : (
                                                    <p>No chemical data</p>
                                                )}
                                            </div> */}
                                            </div>
                                        </div>

                                    )}
                                    <button type="button" className="dropdown-toggle btn btn-lab mt-4" onClick={this.toggleShowMore}>
                                        {showMore ? 'View Less' : 'View More'}
                                    </button>
                                </div>
                                <div className='inventory-modal-actions row px-0 col-xl-2 col-11 mt-0'>
                                    <div className='dropdown ' >
                                        <a role="button" className={`btn dropdown-toggle py-2 w-100 text-bg-${status === "available" ? "success" : status === "in use" ? "warning" : status === "reserved" ? "info" : "danger"}`} href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                            {status === "available" ? "Available" : status === "in use" ? "In Use" : status === "reserved" ? "Reserved" : "Out Of Stock"}
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("available")}
                                                >
                                                    Set "Available"
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("reserved")}
                                                >
                                                    Set "Reserved"
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("in use")}
                                                >
                                                    Set "In Use"
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("out of stock")}
                                                >
                                                    Set "Out Of Stock"
                                                </button>
                                            </li>

                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-body-secondary">Quick Actions</h5>
                                        <div className='d-flex flex-column gap-2'>
                                            <button onClick={() => addToCart(inventory)} type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaCartPlus /><span className='ps-2'></span>Add To Cart</button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'>< FaHistory /><span className='ps-2'>Mark as Favorite</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaBell /><span className='ps-2'>Set Reminder</span></button>

                                        </div>
                                    </div>


                                    {/* <div className="mt-auto"></div> */}
                                    <div>
                                        <h5 className="text-body-secondary">Management Actions</h5>
                                        <div className="d-flex flex-column gap-2">
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaArrowRightLong /><span className='ps-2'>Move</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaRegCopy /><span className='ps-2'>Dublicate</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaTrashAlt /><span className='ps-2'>Remove</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaBoxArchive /><span className='ps-2'>Archive</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaShareNodes /><span className='ps-2'>Shate</span></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default InventoryDetailsModal;
