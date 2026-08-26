import React, { useState, useEffect } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * StorageUnitNavbar — альтернативный UI навигации по storage units (пункт 7).
 * Сейчас нигде не импортируется (дубль логики ParentStorageUnits).
 * Было: fetch('http://localhost:3000/api/storageUnits'...)
 * Стало: http.get(API.storageUnits...)
 * Кандидат на удаление в пункте 8 вместе с "StorageUnitNavbar copy.js".
 */
const fetchUnits = async () => {
	const response = await http.get(API.storageUnits);
	return response.data;
};

const ChildUnits = ({ unit, onUnitClick }) => {
	const [childUnits, setChildUnits] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const loadChildren = async () => {
		if (unit.children && unit.children.length > 0) {
			setChildUnits(unit.children);
		} else {
			setIsLoading(true);

			try {
				const response = await http.get(`${API.storageUnits}/${unit.id}`);
				setChildUnits(response.data.children || []);
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

const StorageUnitNavbar = () => {
	const [units, setUnits] = useState([]);
	const [activeUnit, setActiveUnit] = useState(null);
	const [navHistory, setNavHistory] = useState([]);

	useEffect(() => {
		const loadUnits = async () => {
			const data = await fetchUnits();
			setUnits(data.filter((unit) => unit.storage_id !== null));
		};
		loadUnits();
	}, []);

	const handleUnitClick = (unit) => {
		setNavHistory((prevHistory) => [...prevHistory, activeUnit]);
		setActiveUnit(unit);
	};

	const handleBackClick = () => {
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
									? activeUnit.children?.map((child) => (
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
									: units.map((unit) => (
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

export default StorageUnitNavbar;
