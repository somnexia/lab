import React, { useState, useEffect } from 'react';

// Fetch данные из API
const fetchUnits = async () => {
	const response = await fetch('http://localhost:3000/api/storageUnits');
	const data = await response.json();
	return data;
};

// Компонент для отображения дочерних элементов
const ChildUnits = ({ unit, onUnitClick, filterType, setFilterOptions }) => {
	const [childUnits, setChildUnits] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const loadChildren = async () => {
		if (unit.children && unit.children.length > 0) {
			setChildUnits(unit.children);
		} else {
			setIsLoading(true);
			try {
				const response = await fetch(`http://localhost:3000/api/storageUnits/${unit.id}`);
				const data = await response.json();
				setChildUnits(data.children || []);
			} catch (error) {
				console.error(`Ошибка загрузки детей для блока ${unit.id}:`, error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		loadChildren();
	}, [unit]);

	// Обновляем фильтры на основе текущего уровня
	useEffect(() => {
		const uniqueTypes = [...new Set(childUnits.map((child) => child.unit_type))];
		setFilterOptions(uniqueTypes);
	}, [childUnits, setFilterOptions]);

	// Применяем фильтр
	const filteredUnits = filterType
		? childUnits.filter((child) => child.unit_type === filterType)
		: childUnits;

	return (
		<>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				filteredUnits.map((child) => (
					<li className="nav-item inventory-nav-item mb-1" key={child.id}>
						<a
							className="nav-link inventory-link"
							style={{ cursor: 'pointer' }}
							onClick={() => onUnitClick(child)}
						>
							{child.unit_name}
						</a>
					</li>
				))
			)}
		</>
	);
};

// Основной компонент
const ParentStorageUnits = () => {
	const [units, setUnits] = useState([]);
	const [activeUnit, setActiveUnit] = useState(null); // Текущий выбранный элемент
	const [navHistory, setNavHistory] = useState([]); // История навигации
	const [filterType, setFilterType] = useState(''); // Текущий фильтр
	const [filterOptions, setFilterOptions] = useState([]); // Доступные типы для фильтра

	useEffect(() => {
		// Загружаем данные при загрузке компонента
		const loadUnits = async () => {
			const data = await fetchUnits();
			setUnits(data.filter((unit) => unit.storage_id !== null)); // Фильтруем только родительские
		};
		loadUnits();
	}, []);

	// Обновляем доступные фильтры при первом уровне
	useEffect(() => {
		if (!activeUnit) {
			const uniqueTypes = [...new Set(units.map((unit) => unit.unit_type))];
			setFilterOptions(uniqueTypes);
		}
	}, [units, activeUnit]);

	const handleUnitClick = (unit) => {
		// Добавляем текущий список в историю навигации
		setNavHistory((prevHistory) => [...prevHistory, activeUnit]);
		setActiveUnit(unit); // Устанавливаем текущий активный блок
		setFilterType(''); // Сбрасываем фильтр при переходе на новый уровень
	};

	const handleBackClick = () => {
		// Возвращаемся к предыдущему уровню
		const prevNavHistory = [...navHistory];
		const previousUnit = prevNavHistory.pop();
		setNavHistory(prevNavHistory);
		setActiveUnit(previousUnit || null);
		setFilterType(''); // Сбрасываем фильтр при возврате на предыдущий уровень
	};

	// Применяем фильтрацию для родительских единиц
	const filteredUnits = filterType
		? units.filter((unit) => unit.unit_type === filterType)
		: units;

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
											onClick={handleBackClick}
										>
											Back
										</button>
									</div>
								)}
							</div>
							<hr />
							{/* Поле фильтрации */}
							<div className="filter-section ps-3 mb-3">
								<label htmlFor="filterType" className="form-label">
									Filter by Type:
								</label>
								<select
									id="filterType"
									className="form-select"
									value={filterType}
									onChange={(e) => setFilterType(e.target.value)}
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
									// Показываем дочерние элементы текущего активного блока
									activeUnit.children ? (
										activeUnit.children
											.filter((child) => !filterType || child.unit_type === filterType)
											.map((child) => (
												<li className="nav-item inventory-nav-item mb-1" key={child.id}>
													<a
														className="nav-link inventory-link"
														style={{ cursor: 'pointer' }}
														onClick={() => handleUnitClick(child)}
													>
														{child.unit_name}
													</a>
												</li>
											))
									) : (
										<ChildUnits
											unit={activeUnit}
											onUnitClick={handleUnitClick}
											filterType={filterType}
											setFilterOptions={setFilterOptions}
										/>
									)
								) : (
									// Показываем родительские элементы
									filteredUnits?.map((unit) => (
										<li className="nav-item inventory-nav-item mb-1" key={unit.id}>
											<a
												className="nav-link inventory-link"
												style={{ cursor: 'pointer' }}
												onClick={() => handleUnitClick(unit)}
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

			<div style={{ padding: '20px', flex: 1 }}>
				{activeUnit ? (
					<>
						<h4>{activeUnit.unit_name} Details</h4>
						<p>Type: {activeUnit.unit_type}</p>
						<p>Capacity: {activeUnit.capacity}</p>
						<p>Material: {activeUnit.material}</p>
					</>
				) : (
					<p>Select a storage unit to see details.</p>
				)}
			</div>
		</div>
	);
};

export default ParentStorageUnits;
