import React, { Component } from 'react';
import axios from 'axios';

class DropdownHierarchy extends Component {
	state = {
		storages: [],
		storageUnits: [],
		inventories: [],
		selectedStorage: null,
		selectedStorageUnit: null,
		selectedInventory: null,
		loading: false,
		error: null,
	};
	componentDidMount() {
		this.fetchStorages();
	}
	// Загрузка списка складов
	fetchStorages = async () => {
		try {
			this.setState({ loading: true });
			const response = await axios.get('http://localhost:3000/api/storages');
			this.setState({ storages: response.data, loading: false });
		} catch (error) {
			this.setState({ error: 'Ошибка при загрузке складов', loading: false });
		}
	};
	// Загрузка блоков хранения для выбранного склада
	fetchStorageUnits = async (storageId) => {
		try {
			this.setState({ loading: true, storageUnits: [], inventories: [], selectedStorageUnit: null, selectedInventory: null });
			const response = await axios.get(`http://localhost:3000/api/storageUnits?storage_id=${storageId}`);
			this.setState({ storageUnits: response.data, loading: false });
		} catch (error) {
			this.setState({ error: 'Ошибка при загрузке блоков хранения', loading: false });
		}
	};
	// Загрузка инвентаря для выбранного блока хранения
	fetchInventories = async (storageUnitId) => {
		try {
			this.setState({ loading: true, inventories: [], selectedInventory: null });
			const response = await axios.get(`http://localhost:3000/api/storageUnits/${storageUnitId}/inventories`);
			this.setState({ inventories: response.data, loading: false });
		} catch (error) {
			this.setState({ error: 'Ошибка при загрузке инвентаря', loading: false });
		}
	};
	// Обработчик выбора склада
	handleStorageChange = (event) => {
		const storageId = event.target.value;
		this.setState({ selectedStorage: storageId });
		if (storageId) {
			this.fetchStorageUnits(storageId);
		} else {
			this.setState({ storageUnits: [], inventories: [], selectedStorageUnit: null, selectedInventory: null });
		}
	};
	// Обработчик выбора блока хранения
	handleStorageUnitChange = (event) => {
		const storageUnitId = event.target.value;
		this.setState({ selectedStorageUnit: storageUnitId });
		if (storageUnitId) {
			this.fetchInventories(storageUnitId);
		} else {
			this.setState({ inventories: [], selectedInventory: null });
		}
	};
	// Обработчик выбора инвентаря
	handleInventoryChange = (event) => {
		const inventoryId = event.target.value;
		this.setState({ selectedInventory: inventoryId });
	};
	render() {
		const {
			storages,
			storageUnits,
			inventories,
			selectedStorage,
			selectedStorageUnit,
			selectedInventory,
			loading,
			error,
		} = this.state;
		return (
			<div className='container-fluid'>
				<h2>Overview</h2>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				
				{/* Выпадающий список складов */}
				<div>
					<label htmlFor="storage-select">Выберите склад:</label>
					<select id="storage-select" value={selectedStorage || ''} onChange={this.handleStorageChange}>
						<option value="">-- Выберите склад --</option>
						{storages.map((storage) => (
							<option key={storage.id} value={storage.id}>
								{storage.name}
							</option>
						))}
					</select>
				</div>
				{/* Выпадающий список блоков хранения */}
				{selectedStorage && (
					<div>
						<label htmlFor="storage-unit-select">Выберите блок хранения:</label>
						<select id="storage-unit-select" value={selectedStorageUnit || ''} onChange={this.handleStorageUnitChange}>
							<option value="">-- Выберите блок хранения --</option>
							{storageUnits.map((unit) => (
								<option key={unit.id} value={unit.id}>
									{unit.unit_name} ({unit.unit_type})
								</option>
							))}
						</select>
					</div>
				)}
				{/* Список инвентаря */}
				{selectedStorageUnit && (
					<div>
						<h3>Инвентарь в блоке хранения:</h3>
						<ul>
							{inventories.map((item) => (
								<li key={item.id}>
									{item.item_name} — {item.InventoryStorageUnit.quantity} {item.unit_measure || ''}
									{item.description && ` (${item.description})`}
								</li>
							))}
						</ul>
					</div>
				)}
				{loading && <p>Загрузка...</p>}
			</div>
		);
	}
}

export default DropdownHierarchy;
