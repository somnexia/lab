import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InventoryDetailsModal from './InventoryDetailsModal';
import InventoryTable from './InventoryTable';
import { CartContext } from '../context/CartContext';
import { enrichInventoryLot, enrichInventoryLots, getStockFilterParams } from '../utils/inventoryEnrichment';
import { API_INVENTORIES } from '../config/api';

const STOCK_FILTERS = [
  { id: 'all', label: 'All materials' },
  { id: 'reagents', label: 'Reagents only' },
  { id: 'equipment', label: 'Equipment only' },
];

class InventoryStockOverview extends Component {
  static contextType = CartContext;

  state = {
    inventories: [],
    stockFilter: 'all',
    selectedInventory: null,
    loading: false,
    modalLoading: false,
    error: null,
    isModalOpen: false,
  };

  componentDidMount() {
    this.fetchInventories();
  }

  fetchInventories = async () => {
    const { stockFilter } = this.state;

    try {
      this.setState({ loading: true, error: null });
      const response = await axios.get(API_INVENTORIES, {
        params: getStockFilterParams(stockFilter),
      });
      this.setState({
        inventories: enrichInventoryLots(response.data),
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load stock lots:', error);
      this.setState({ error: 'Failed to load stock lots', loading: false });
    }
  };

  handleStockFilterChange = (stockFilter) => {
    this.setState({ stockFilter }, this.fetchInventories);
  };

  handleAddToCart = (inventory) => {
    const { addToCart } = this.context;
    addToCart(inventory);
  };

  openModal = async (inventory) => {
    try {
      this.setState({
        selectedInventory: enrichInventoryLot(inventory),
        isModalOpen: true,
        modalLoading: true,
        error: null,
      });

      const inventoryResponse = await axios.get(`${API_INVENTORIES}/filter`, {
        params: {
          reference_id: inventory.reference_id,
          item_type: inventory.item_type,
        },
      });

      const inventoryData = inventoryResponse.data[0] || inventory;
      let location = 'Not assigned';
      let locationChain = [];

      if (inventoryData.storageUnits?.length) {
        const storageUnitId = inventoryData.storageUnits[0].id;
        const locationChainResponse = await axios.get(
          `http://localhost:3000/api/storageunits/${storageUnitId}/location-chain`
        );
        locationChain = locationChainResponse.data || [];
        location = locationChain.length
          ? locationChain.map((unit) => unit.name).join(' > ')
          : location;
      }

      const fullInventory = enrichInventoryLot({
        ...inventory,
        chemCompound: inventoryData.chemCompound || inventory.chemCompound || null,
        chemEquipment: inventoryData.chemEquipment || inventory.chemEquipment || null,
        chemElement: inventoryData.chemElement || inventory.chemElement || null,
        chemMixture: inventoryData.chemMixture || inventory.chemMixture || null,
        storageUnits: inventoryData.storageUnits || inventory.storageUnits || [],
        location,
        locationChain,
      });

      this.setState({
        selectedInventory: fullInventory,
        modalLoading: false,
      });
    } catch (error) {
      console.error('Failed to load lot details:', error);
      this.setState({
        error: 'Failed to load lot details',
        modalLoading: false,
      });
    }
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedInventory: null,
    });
  };

  renderFilterBar = () => {
    const { stockFilter } = this.state;

    return (
      <div className="inventory-stock-filters" role="tablist" aria-label="Stock type filter">
        {STOCK_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={stockFilter === id}
            className={`inventory-stock-filters__chip${stockFilter === id ? ' is-active' : ''}`}
            onClick={() => this.handleStockFilterChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  render() {
    const {
      inventories,
      selectedInventory,
      loading,
      modalLoading,
      error,
      isModalOpen,
      stockFilter,
    } = this.state;

    const { addToCart } = this.context;
    const isFullPage = Boolean(this.props.fullPage);
    const variant = this.props.variant || (isFullPage ? 'list' : 'overview');
    const isLotsPage = variant === 'lots';

    const titleByVariant = {
      overview: 'Stock overview',
      list: 'Stock lots',
      lots: this.props.sectionTitle || 'Lots & batches',
    };

    const descriptionByVariant = {
      overview: (
        <>
          Warehouse view: each row is a physical lot (quantity, status, expiry, location).
          {' '}
          <Link to="/inventory/chemicals">Open reagent catalog</Link>
          {' '}
          or <Link to="/inventory/lots">view all lots</Link>.
        </>
      ),
      list: 'Full warehouse lot table with catalog labels and storage details.',
      lots: this.props.sectionDescription || 'Cross-material traceability: every batch on hand with expiry and location.',
    };

    const filterLabel = STOCK_FILTERS.find((item) => item.id === stockFilter)?.label || 'All materials';

    return (
      <div className={`inventory-stock-overview${isFullPage ? ' inventory-stock-overview--full' : ''}`}>
        <header className="inventory-stock-overview__header">
          <div>
            <p className="inventory-page__eyebrow">Materials inventory</p>
            <h1 className="inventory-page__title">{titleByVariant[variant]}</h1>
            <p className="inventory-page__subtitle">{descriptionByVariant[variant]}</p>
          </div>
          {this.props.headerAction ? (
            <div className="inventory-stock-overview__header-action">
              {this.props.headerAction}
            </div>
          ) : null}
        </header>

        {this.renderFilterBar()}

        <InventoryTable
          compact={!isFullPage}
          error={error}
          fullViewLink={isFullPage ? null : '/inventory/lots'}
          inventories={inventories}
          loading={loading}
          maxRows={isFullPage ? null : 6}
          onAddToCart={this.handleAddToCart}
          onOpenDetails={this.openModal}
          sectionDescription={`Showing ${filterLabel.toLowerCase()}. Lots are stock records linked to catalog entries.`}
          sectionTitle={isLotsPage ? null : (isFullPage ? 'All stock lots' : 'Recent stock lots')}
          useCatalogLabels
        />

        {selectedInventory && (
          <InventoryDetailsModal
            isOpen={isModalOpen}
            inventory={selectedInventory}
            onClose={this.closeModal}
            loading={modalLoading}
            error={error}
            addToCart={addToCart}
          />
        )}
      </div>
    );
  }
}

export default InventoryStockOverview;
