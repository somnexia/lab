import React, { Component } from 'react';

class InventoryTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inventories: [],
			loading: true,
			error: null,
		};
	}

	// Метод для загрузки инвентаря активной ячейки
	loadInventory = async () => {
		const { activeStorageUnitId } = this.props; // Получаем активную ячейку из пропсов
		if (!activeStorageUnitId) {
			this.setState({ inventories: [], locationChain: [], loading: false, error: 'Нет активной ячейки хранения.' });
			return;
		}

		this.setState({ loading: true, error: null });

		try {
			// Запрос для получения инвентаря
			const inventoryResponse = await fetch(`http://localhost:3000/api/inventoryStorageUnit/${activeStorageUnitId}/inventories`);
			if (!inventoryResponse.ok) throw new Error('Не удалось загрузить данные инвентаря.');
			const inventoryData = await inventoryResponse.json();
			console.log('Inventory data inventories:', inventoryData);

			// Запрос для получения цепочки расположения
			const locationResponse = await fetch(`http://localhost:3000/api/inventoryStorageUnit/${activeStorageUnitId}/inventories-with-location`);
			if (!locationResponse.ok) throw new Error('Не удалось загрузить цепочку расположения.');
			const locationData = await locationResponse.json();
			console.log('Inventory data inventories-with-location:', inventoryData);


			// Обновляем состояние компонента с результатами обоих запросов
			const combinedData = inventoryData.map((item, index) => ({
				...item,
				location: locationData[index] ? locationData[index].location : null, // Подключение данных location, если они есть
			  }));

			this.setState({
				inventories: combinedData,
				loading: false,
			});

		} catch (error) {
			this.setState({
				error: error.message,
				loading: false,  
			});
		}
	};

	// Загружаем данные при монтировании
	componentDidMount() {
		this.loadInventory();
	}

	// Обновляем данные при изменении активной ячейки хранения
	componentDidUpdate(prevProps) {
		if (prevProps.activeStorageUnitId !== this.props.activeStorageUnitId) {
			this.loadInventory();
		}
	}

	renderTableRows = () => {
		const { inventories } = this.state;
		if (Array.isArray(inventories) && inventories.length > 0) {
			return inventories.map((item) => {
				console.log('Location data:', item.location);
				console.log('Inventory item:', item);
				return (

					<tr key={item.id}>
						<td>{item.id}</td>
						<td>{item.item_name || 'Не указано'}</td>
						<td>{item.item_type || 'Не указано'}</td>
						<td>{item.quantity || 'Не указано'}</td>
						<td>{item.total_quantity || (item.substance_amount ? `${item.substance_amount} ${item.unit_measure}` : 'N/A')}</td>
						<td>{item.substance_amount || 'N/A'}</td>
						<td>{item.unit_measure || 'N/A'}</td>
						<td>
							{item.location && item.location.length > 0
								? item.location.map(loc => loc.name || 'N/A').join(' > ')
								: 'N/A'}
						</td>

						{/* <td>
						{item.location && item.location.length > 0
							? item.location.map(loc => loc.name || 'N/A').join(' > ')
							: 'N/A'}
					</td> */}
						{/* <td>{Array.isArray(item.location) ? item.location.map(loc => `${loc.name} (${loc.type})`).join(' -> ') : 'N/A'}</td> */}
						<td>{item.receipt_date ? new Date(item.receipt_date).toLocaleDateString() : 'N/A'}</td>
						<td>{item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}</td>
						<td>{item.supplier || 'Не указано'}</td>
						<td>{item.status || 'Не указано'}</td>
						<td>{item.description || 'Не указано'}</td>
						<td>{item.safety_info || 'Не указано'}</td>
					</tr>
				);
			});
		} else {
			return (
				<tr>
					<td colSpan="11">Нет данных о инвентаре.</td>
				</tr>
			);
		}
	};

	render() {
		const { loading, error } = this.state;

		return (
			<div className="table-responsive">
				<table className="table bg-body-emphasis table-dark table-striped table-hover table-bordered">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Type</th>
							<th>Storage Unit Quantity</th>
							<th>Total Quantity</th>
							<th>Substance Amount</th>
							<th>Unit measure</th>
							<th>Location</th>
							<th>Receipt Date</th>
							<th>Expiration Date</th>
							<th>Supplier</th>
							<th>Status</th>
							<th>Discription</th>
							<th>Safety Info</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="13">Загрузка...</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan="13">Ошибка: {error}</td>
							</tr>
						) : (
							this.renderTableRows()
						)}
					</tbody>
				</table>
			</div>
		);
	}
}

export default InventoryTable;
