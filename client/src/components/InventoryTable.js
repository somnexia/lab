import React, { Component } from 'react';
import { Link } from "react-router-dom";

class InventoryTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inventories: [],
			loading: Boolean(props.activeStorageUnitId),
			error: null,
		};
	}

	static defaultProps = {
		compact: false,
		maxRows: null,
		showActions: true,
		fullViewLabel: 'View full inventory',
	};

	shouldLoadStorageInventory = () => {
		return !Array.isArray(this.props.inventories) && Boolean(this.props.activeStorageUnitId);
	};

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
		if (this.shouldLoadStorageInventory()) {
			this.loadInventory();
		}
	}

	// Обновляем данные при изменении активной ячейки хранения
	componentDidUpdate(prevProps) {
		if (this.shouldLoadStorageInventory() && prevProps.activeStorageUnitId !== this.props.activeStorageUnitId) {
			this.loadInventory();
		}
	}

	getInventories = () => {
		return Array.isArray(this.props.inventories) ? this.props.inventories : this.state.inventories;
	};

	getLoading = () => {
		return typeof this.props.loading === 'boolean' ? this.props.loading : this.state.loading;
	};

	getError = () => {
		return this.props.error || this.state.error;
	};

	getQuantityLabel = (item) => {
		if (item.total_quantity !== undefined && item.total_quantity !== null) {
			return item.unit_measure ? `${item.total_quantity} ${item.unit_measure}` : item.total_quantity;
		}

		if (item.quantity !== undefined && item.quantity !== null) {
			return item.unit_measure ? `${item.quantity} ${item.unit_measure}` : item.quantity;
		}

		if (item.substance_amount) {
			return item.unit_measure ? `${item.substance_amount} ${item.unit_measure}` : item.substance_amount;
		}

		return 'N/A';
	};

	getLocationLabel = (item) => {
		if (Array.isArray(item.location) && item.location.length > 0) {
			return item.location.map((loc) => loc.name || 'N/A').join(' > ');
		}

		if (typeof item.location === 'string' && item.location.trim()) {
			return item.location;
		}

		if (Array.isArray(item.storageUnits) && item.storageUnits.length > 0) {
			return item.storageUnits.map((unit) => unit.unit_name || unit.name || 'N/A').join(' > ');
		}

		return 'N/A';
	};

	formatDate = (value) => {
		return value ? new Date(value).toLocaleDateString() : 'N/A';
	};

	getStatusClass = (status = '') => {
		const normalizedStatus = String(status).toLowerCase();

		if (normalizedStatus.includes('active') || normalizedStatus.includes('available') || normalizedStatus.includes('in stock')) {
			return 'inventory-table__status--success';
		}

		if (normalizedStatus.includes('low') || normalizedStatus.includes('pending')) {
			return 'inventory-table__status--warning';
		}

		if (normalizedStatus.includes('expired') || normalizedStatus.includes('out')) {
			return 'inventory-table__status--danger';
		}

		return 'inventory-table__status--neutral';
	};

	renderStatus = (status) => {
		const label = status || 'N/A';

		return (
			<span className={`inventory-table__status ${this.getStatusClass(label)}`}>
				{label}
			</span>
		);
	};

	renderActions = (item) => {
		const { onOpenDetails, onAddToCart, showActions } = this.props;

		if (!showActions || (!onOpenDetails && !onAddToCart)) {
			return null;
		}

		return (
			<div className="inventory-table__actions">
				{onOpenDetails && (
					<button
						className="inventory-table__action inventory-table__action--ghost"
						onClick={() => onOpenDetails(item)}
						type="button"
					>
						Details
					</button>
				)}
				{onAddToCart && (
					<button
						className="inventory-table__action inventory-table__action--primary"
						onClick={() => onAddToCart(item)}
						type="button"
					>
						Add
					</button>
				)}
			</div>
		);
	};

	getColumns = () => {
		const { compact, showActions, onOpenDetails, onAddToCart } = this.props;
		const hasActions = showActions && (onOpenDetails || onAddToCart);

		if (compact) {
			return [
				{ key: 'name', label: 'Item' },
				{ key: 'type', label: 'Type' },
				{ key: 'quantity', label: 'Quantity' },
				{ key: 'status', label: 'Status' },
				{ key: 'updated', label: 'Updated' },
				...(hasActions ? [{ key: 'actions', label: 'Actions' }] : []),
			];
		}

		return [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' },
			{ key: 'type', label: 'Type' },
			{ key: 'reference', label: 'Reference' },
			{ key: 'quantity', label: 'Quantity' },
			{ key: 'unit', label: 'Unit' },
			{ key: 'status', label: 'Status' },
			{ key: 'supplier', label: 'Supplier' },
			{ key: 'receipt', label: 'Receipt' },
			{ key: 'expiration', label: 'Expiration' },
			{ key: 'location', label: 'Location' },
			{ key: 'safety', label: 'Safety' },
			...(hasActions ? [{ key: 'actions', label: 'Actions' }] : []),
		];
	};

	renderCell = (item, key) => {
		switch (key) {
			case 'id':
				return item.id || 'N/A';
			case 'name': {
				const displayName = this.props.useCatalogLabels
					? (item.catalogName || item.item_name || 'Unnamed lot')
					: (item.item_name || 'Название отсутствует');
				const meta = this.props.useCatalogLabels && item.catalogFormula
					? item.catalogFormula
					: `#${item.id || 'N/A'}`;

				return (
					<button
						className="inventory-table__item-button"
						disabled={!this.props.onOpenDetails}
						onClick={() => this.props.onOpenDetails && this.props.onOpenDetails(item)}
						type="button"
					>
						<span className="inventory-table__item-name">{displayName}</span>
						<span className="inventory-table__item-meta">{meta}</span>
					</button>
				);
			}
			case 'type':
				return <span className="inventory-table__type">{item.item_type || 'N/A'}</span>;
			case 'reference':
				return item.reference_id || 'N/A';
			case 'quantity':
				return <strong>{this.getQuantityLabel(item)}</strong>;
			case 'unit':
				return item.unit_measure || 'N/A';
			case 'status':
				return this.renderStatus(item.status);
			case 'supplier':
				return item.supplier || 'N/A';
			case 'receipt':
				return this.formatDate(item.receipt_date);
			case 'expiration':
				return this.formatDate(item.expiration_date);
			case 'location':
				return <span className="inventory-table__muted">{this.getLocationLabel(item)}</span>;
			case 'safety':
				return <span className="inventory-table__muted">{item.safety_info || 'N/A'}</span>;
			case 'updated':
				return this.formatDate(item.last_updated);
			case 'actions':
				return this.renderActions(item);
			default:
				return 'N/A';
		}
	};

	renderTableRows = (columns, displayedInventories) => {
		const loading = this.getLoading();
		const error = this.getError();

		if (loading) {
			return (
				<tr>
					<td className="inventory-table__state" colSpan={columns.length}>
						Загрузка...
					</td>
				</tr>
			);
		}

		if (error) {
			return (
				<tr>
					<td className="inventory-table__state inventory-table__state--error" colSpan={columns.length}>
						{error}
					</td>
				</tr>
			);
		}

		if (!displayedInventories.length) {
			return (
				<tr>
					<td className="inventory-table__state" colSpan={columns.length}>
						Inventory not found
					</td>
				</tr>
			);
		}

		return displayedInventories.map((item) => (
			<tr key={item.id}>
				{columns.map(({ key }) => (
					<td key={key}>{this.renderCell(item, key)}</td>
				))}
			</tr>
		));
	};

	render() {
		const {
			compact,
			fullViewLabel,
			fullViewLink,
			maxRows,
			sectionDescription,
			sectionTitle,
		} = this.props;
		const inventories = this.getInventories();
		const totalCount = inventories.length;
		const displayedInventories = compact && maxRows ? inventories.slice(0, maxRows) : inventories;
		const hiddenCount = Math.max(totalCount - displayedInventories.length, 0);
		const columns = this.getColumns();
		const table = (
			<>
				<div className="inventory-table-wrap">
					<table className={`inventory-table table ${compact ? 'inventory-table--compact' : 'inventory-table--full'}`}>
						<thead>
							<tr>
								{columns.map(({ key, label }) => (
									<th key={key}>{label}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{this.renderTableRows(columns, displayedInventories)}
						</tbody>
					</table>
				</div>
				{compact && hiddenCount > 0 && (
					<div className="inventory-table__summary">
						Showing {displayedInventories.length} of {totalCount} inventory records.
					</div>
				)}
			</>
		);

		if (!sectionTitle && !fullViewLink) {
			return table;
		}

		return (
			<section className="inventory-list-section">
				<div className="inventory-list-section__header">
					<div>
						{sectionTitle && <h3 className="inventory-list-section__title">{sectionTitle}</h3>}
						{sectionDescription && (
							<p className="inventory-list-section__description">{sectionDescription}</p>
						)}
					</div>
					<div className="inventory-list-section__actions">
						<span className="inventory-list-section__count">{totalCount} items</span>
						{fullViewLink && (
							<Link className="inventory-list-section__link" to={fullViewLink}>
								{fullViewLabel}
							</Link>
						)}
					</div>
				</div>
				{table}
			</section>
		);
	}
}

export default InventoryTable;
