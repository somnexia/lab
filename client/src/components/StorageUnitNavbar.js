import React, { useState, useEffect } from 'react';

// Fetch данные из API
const fetchUnits = async () => {
	const response = await fetch('http://localhost:3000/api/storageUnits');
	const data = await response.json();
	return data;
};

// Компонент для отображения дочерних элементов
const ChildUnits = ({ unit, onUnitClick }) => {
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
	

	return (
		<>
			{isLoading ? (
				<p>Loading...</p>
			) : (

				childUnits.map((child) => (
					<li className="nav-item inventory-nav-item mb-1" key={child.id}>
						<a className="nav-link inventory-link"
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

	useEffect(() => {
		// Загружаем данные при загрузке компонента
		const loadUnits = async () => {
			const data = await fetchUnits();
			setUnits(data.filter((unit) => unit.storage_id !== null)); // Фильтруем только родительские
		};
		loadUnits();
	}, []);

	const handleUnitClick = (unit) => {
		// Добавляем текущий список в историю навигации
		setNavHistory((prevHistory) => [...prevHistory, activeUnit]);
		setActiveUnit(unit); // Устанавливаем текущий активный блок
	};

	const handleBackClick = () => {
		// Возвращаемся к предыдущему уровню
		const prevNavHistory = [...navHistory];
		const previousUnit = prevNavHistory.pop();
		setNavHistory(prevNavHistory);
		setActiveUnit(previousUnit || null);
	};

	return (
		<div className="inventory-content">
			<div className="navbar-vertical navbar inventory-navbar navbar-expand-md bg-body-primary navbar-dark" id="navId">
				<div className="navbar-collapse collapse" id="navbarToggler">
					<div className="navbar-vertical-content">
						<div className="vertical-nav-scroll py-3 flex-column" data-bs-spy="scroll" data-bs-target="#navId">
							<div className="navbar-vertical-header ps-3 d-flex justify-content-between">
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
							<ul className="nav flex-column navbar-nav">
								{activeUnit
									? // Показываем дочерние элементы текущего активного блока
									activeUnit.children?.map((child) => (
										<li className="nav-item inventory-nav-item mb-1" key={child.id}>
											<a
												className="nav-link inventory-link"
												style={{ cursor: 'pointer' }}
												onClick={() => handleUnitClick(child)}
											>
												{child.unit_name}
											</a>
										</li>
									)) || (
										<ChildUnits unit={activeUnit} onUnitClick={handleUnitClick} />
									)
									: // Показываем родительские элементы
									units.map((unit) => (
										<li className="nav-item inventory-nav-item mb-1" key={unit.id}>
											<a
												className="nav-link inventory-link"
												style={{ cursor: 'pointer' }}
												onClick={() => handleUnitClick(unit)}
											>
												{unit.unit_name}
											</a>
										</li>
									))}
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
