import React, { Component } from 'react';
import ChildStorageUnits from './ChildStorageUnits'; // Импорт нового компонента
import InventoryTable from './InventoryTable'; // Импорт компонента InventoryTable

// Функция для получения данных
const fetchUnits = async () => {
	const response = await fetch('http://localhost:3000/api/storageUnits');
	const data = await response.json();
	return data;
};

class ParentStorageUnits extends Component {
	constructor(props) {
		super(props);
		this.state = {
			units: [],
			activeUnit: null, // Текущий выбранный элемент
			filterType: '', // Текущий фильтр
			filterOptions: [], // Доступные типы для фильтра
			navHistory: [], // История навигации
		};
	}

	// Загружаем данные при монтировании компонента
	componentDidMount() {
		this.loadUnits();
	}

	loadUnits = async () => {
		const data = await fetchUnits();
		this.setState({
			units: data.filter((unit) => unit.storage_id !== null), // Фильтруем только родительские
		});
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevState.units !== this.state.units && !this.state.activeUnit) {
			const uniqueTypes = [...new Set(this.state.units.map((unit) => unit.unit_type))];
			this.setState({ filterOptions: uniqueTypes });
		}
	}

	handleUnitClick = (unit) => {
		console.log('Clicked unit:', unit);
		this.setState((prevState) => ({
			navHistory: [...prevState.navHistory, prevState.activeUnit],
			activeUnit: unit,
			filterType: '',
		}), () => {
			console.log('Updated activeUnit:', this.state.activeUnit);
		});
	};

	handleBackClick = () => {
		// Возвращаемся к предыдущему уровню
		const prevNavHistory = [...this.state.navHistory];
		const previousUnit = prevNavHistory.pop();
		this.setState({
			navHistory: prevNavHistory,
			activeUnit: previousUnit || null,
			filterType: '', // Сбрасываем фильтр при возврате на предыдущий уровень
		});
	};

	getFilteredUnits = () => {
		const { filterType, units } = this.state;
		return filterType
			? units.filter((unit) => unit.unit_type === filterType)
			: units;
	};

	render() {
		const {
			activeUnit,
			navHistory,
			filterType,
			filterOptions,
		} = this.state;
		const filteredUnits = this.getFilteredUnits();

		return (
			<div className="inventory-content">
				<div className="navbar-vertical navbar inventory-navbar navbar-expand-md bg-body-primary navbar-dark" id="navId">
					<div className="navbar-collapse collapse" id="navbarToggler">
						<div className="navbar-vertical-content">
							<div className="vertical-nav-scroll py-3 flex-column" data-bs-spy="scroll" data-bs-target="#navId">
								<div className="navbar-vertical-header ps-3 d-flex justify-content-between align-items-center">
									<div>
										<span className="fw-bold">
											{activeUnit ? activeUnit.unit_name : 'Parent Storage Units'}
										</span>
									</div>
									{activeUnit && (
										<div>
											<button
												className="btn btn-sm btn-outline-light mx-2"
												style={{ cursor: 'pointer' }}
												onClick={this.handleBackClick}
											>
												Back
											</button>
										</div>
									)}
								</div>
								<hr />
								<div className="filter-section ps-3 mb-3">
									<label htmlFor="filterType" className="form-label">
										Filter by Type:
									</label>
									<select
										id="filterType"
										className="form-select"
										value={filterType}
										onChange={(e) => this.setState({ filterType: e.target.value })}
									>
										<option value="">All Types</option>
										{filterOptions.map((type) => (
											<option key={type} value={type}>
												{type}
											</option>
										))}
									</select>
								</div>
								<ul className="nav flex-column navbar-nav">
									{activeUnit ? (
										activeUnit.children && activeUnit.children.length > 0 ? (
											activeUnit.children
												.filter((child) => !filterType || child.unit_type === filterType)
												.map((child) => (
													<li className="nav-item inventory-nav-item mb-1" key={child.id}>
														<a
															className="nav-link inventory-link"
															style={{ cursor: 'pointer' }}
															onClick={() => this.handleUnitClick(child)}
														>
															{child.unit_name}
														</a>
													</li>
												))
										) : (
											<ChildStorageUnits
												unit={activeUnit}
												onUnitClick={this.handleUnitClick}
												filterType={filterType}
												setFilterOptions={(options) => this.setState({ filterOptions: options })}
											/>
										)
									) : (
										filteredUnits?.map((unit) => (
											<li className="nav-item inventory-nav-item mb-1" key={unit.id}>
												<a
													className="nav-link inventory-link"
													style={{ cursor: 'pointer' }}
													onClick={() => this.handleUnitClick(unit)}
												>
													{unit.unit_name}
												</a>
											</li>
										))
									)}
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="row g-3">
					<div className="card bg-body-emphasis text-bg-dark border-0 h-100">
						<div className="card-header pt-3 border-0">
							<h3 className="card-header-title">Storage Units</h3>
						</div>
						<div className="card-body">
							{activeUnit ? (
								<div className="table-responsive">
									<table className="table bg-body-emphasis table-dark table-striped table-hover table-bordered">
										<thead>
											<tr>
												<th>ID</th>
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
											</tr>
										</thead>
										<tbody>
											<tr>
												<th>{activeUnit.id}</th>
												<td>{activeUnit.unit_name}</td>
												<td>{activeUnit.unit_type}</td>
												<td>{activeUnit.capacity || 'N/A'}</td>
												<td>{activeUnit.current_utilization || 'N/A'}</td>
												<td>{activeUnit.temperature || 'N/A'}</td>
												<td>{activeUnit.humidity || 'N/A'}</td>
												<td>{activeUnit.pressure || 'N/A'}</td>
												<td>{activeUnit.material || 'N/A'}</td>
												<td>{activeUnit.safety_rating || 'N/A'}</td>
												<td>{activeUnit.last_maintenance_date || 'N/A'}</td>
												<td>{activeUnit.next_maintenance_date || 'N/A'}</td>
											</tr>
										</tbody>
									</table>
								</div>
							) : (
								<h5>Select a storage unit to see details.</h5>
							)}
						</div>
					</div>

					<div className="card bg-body-emphasis text-bg-dark border-0 h-100">
						<div className="card-header pt-3 border-0">
							<h3 className="card-header-title">Inventory</h3>
						</div>
						<div className="card-body">
							{/* Передаем ID активной единицы в компонент InventoryTable */}
							{activeUnit ? (
								<InventoryTable activeStorageUnitId={activeUnit.id} />
							) : (
								<h5>Select a storage unit to see inventory.</h5>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ParentStorageUnits;
