import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReagentCatalogTable from '../components/ReagentCatalogTable';
import ReagentDetailModal from '../components/ReagentDetailModal';
import InventoryDetailsModal from '../components/InventoryDetailsModal';
import { CartContext } from '../context/CartContext';
import { enrichInventoryLot } from '../utils/inventoryEnrichment';
import { getInventoryMaterialsMeta } from './inventorySections';

const API_REAGENTS = 'http://localhost:3000/api/reagents';
const API_INVENTORIES = 'http://localhost:3000/api/inventories';

const TYPE_TABS = [
  { id: 'all', label: 'All', types: 'element,compound,mixture' },
  { id: 'element', label: 'Elements', types: 'element' },
  { id: 'compound', label: 'Compounds', types: 'compound' },
  { id: 'mixture', label: 'Mixtures', types: 'mixture' },
];

const STOCK_TABS = [
  { id: 'all', label: 'Any stock' },
  { id: 'in', label: 'In stock' },
  { id: 'out', label: 'Out of stock' },
];

class ReagentCatalogPage extends Component {
  static contextType = CartContext;

  state = {
    reagents: [],
    summary: null,
    loading: false,
    error: null,
    typeTab: 'all',
    stockTab: 'all',
    search: '',
    selectedReagent: null,
    selectedReagentDetail: null,
    reagentModalOpen: false,
    reagentModalLoading: false,
    selectedLot: null,
    lotModalOpen: false,
    lotModalLoading: false,
    lotModalError: null,
  };

  componentDidMount() {
    this.fetchReagents();
    this.fetchSummary();
  }

  getTypesParam = () => {
    const tab = TYPE_TABS.find((item) => item.id === this.state.typeTab);
    return tab?.types || 'element,compound,mixture';
  };

  getInStockParam = () => {
    if (this.state.stockTab === 'in') return 'true';
    if (this.state.stockTab === 'out') return 'false';
    return undefined;
  };

  fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_REAGENTS}/summary`);
      this.setState({ summary: response.data });
    } catch (error) {
      console.error('Failed to load reagent summary:', error);
    }
  };

  fetchReagents = async () => {
    try {
      this.setState({ loading: true, error: null });
      const response = await axios.get(API_REAGENTS, {
        params: {
          types: this.getTypesParam(),
          q: this.state.search.trim() || undefined,
          inStock: this.getInStockParam(),
        },
      });
      this.setState({ reagents: response.data, loading: false });
    } catch (error) {
      console.error('Failed to load reagent catalog:', error);
      this.setState({ error: 'Failed to load reagent catalog', loading: false });
    }
  };

  handleTypeTab = (typeTab) => {
    this.setState({ typeTab }, this.fetchReagents);
  };

  handleStockTab = (stockTab) => {
    this.setState({ stockTab }, this.fetchReagents);
  };

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value });
  };

  handleSearchSubmit = (event) => {
    event.preventDefault();
    this.fetchReagents();
  };

  openReagentModal = async (reagent) => {
    this.setState({
      selectedReagent: reagent,
      reagentModalOpen: true,
      reagentModalLoading: true,
      selectedReagentDetail: null,
    });

    try {
      const response = await axios.get(`${API_REAGENTS}/${reagent.kind}/${reagent.catalogId}`);
      this.setState({
        selectedReagentDetail: response.data,
        reagentModalLoading: false,
      });
    } catch (error) {
      console.error('Failed to load reagent detail:', error);
      this.setState({
        error: 'Failed to load reagent details',
        reagentModalLoading: false,
        reagentModalOpen: false,
      });
    }
  };

  closeReagentModal = () => {
    this.setState({
      reagentModalOpen: false,
      selectedReagent: null,
      selectedReagentDetail: null,
    });
  };

  handleCompositionSaved = (result) => {
    this.setState((prev) => ({
      selectedReagentDetail: prev.selectedReagentDetail
        ? {
          ...prev.selectedReagentDetail,
          components: result.components,
          composition: result.compositionSummary,
        }
        : prev.selectedReagentDetail,
    }));
    this.fetchReagents();
  };

  openLotModal = async (lot) => {
    try {
      this.setState({
        selectedLot: enrichInventoryLot(lot),
        lotModalOpen: true,
        lotModalLoading: true,
        lotModalError: null,
      });

      const inventoryResponse = await axios.get(`${API_INVENTORIES}/filter`, {
        params: {
          reference_id: lot.reference_id,
          item_type: lot.item_type,
        },
      });

      const inventoryData = inventoryResponse.data.find((row) => row.id === lot.id)
        || inventoryResponse.data[0]
        || lot;

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

      this.setState({
        selectedLot: enrichInventoryLot({
          ...lot,
          ...inventoryData,
          location,
          locationChain,
        }),
        lotModalLoading: false,
      });
    } catch (error) {
      console.error('Failed to load lot:', error);
      this.setState({
        lotModalError: 'Failed to load lot details',
        lotModalLoading: false,
      });
    }
  };

  closeLotModal = () => {
    this.setState({
      lotModalOpen: false,
      selectedLot: null,
      lotModalError: null,
    });
  };

  handleAddLotToCart = (lot) => {
    this.context.addToCart(lot);
  };

  renderSummaryCards = () => {
    const { summary } = this.state;
    if (!summary) return null;

    return (
      <div className="reagent-catalog-page__stats">
        <article className="reagent-catalog-page__stat">
          <strong>{summary.catalogTotal}</strong>
          <span>Catalog entries</span>
        </article>
        <article className="reagent-catalog-page__stat">
          <strong>{summary.inStockCount}</strong>
          <span>With stock</span>
        </article>
        <article className="reagent-catalog-page__stat">
          <strong>{summary.outOfStockCount}</strong>
          <span>Zero stock</span>
        </article>
        <article className="reagent-catalog-page__stat">
          <strong>{summary.lotCount}</strong>
          <span>Stock lots</span>
        </article>
      </div>
    );
  };

  render() {
    const {
      reagents,
      loading,
      error,
      typeTab,
      stockTab,
      search,
      reagentModalOpen,
      reagentModalLoading,
      selectedReagentDetail,
      lotModalOpen,
      lotModalLoading,
      selectedLot,
      lotModalError,
    } = this.state;

    const meta = getInventoryMaterialsMeta('/inventory/chemicals');
    const { addToCart } = this.context;

    return (
      <div className="reagent-catalog-page inventory-page">
        <header className="inventory-page__hero reagent-catalog-page__hero">
          <div>
            <p className="inventory-page__eyebrow">Materials inventory</p>
            <h1 className="inventory-page__title">{meta?.title || 'Chemicals & reagents'}</h1>
            <p className="inventory-page__subtitle">
              {meta?.hint || 'Catalog of registered reagents. Each row is a chemical identity; open a row to see stock lots.'}
              {' '}
              <Link to="/inventory/overview">View all stock lots</Link>
            </p>
          </div>
        </header>

        {this.renderSummaryCards()}

        <div className="reagent-catalog-page__toolbar">
          <div className="reagent-catalog-page__tabs" role="tablist" aria-label="Reagent type">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={typeTab === tab.id}
                className={`inventory-stock-filters__chip${typeTab === tab.id ? ' is-active' : ''}`}
                onClick={() => this.handleTypeTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="reagent-catalog-page__tabs" role="tablist" aria-label="Stock filter">
            {STOCK_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={stockTab === tab.id}
                className={`inventory-stock-filters__chip${stockTab === tab.id ? ' is-active' : ''}`}
                onClick={() => this.handleStockTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form className="reagent-catalog-page__search" onSubmit={this.handleSearchSubmit}>
            <input
              type="search"
              className="reagent-catalog-page__search-input"
              placeholder="Search name, CAS, formula…"
              value={search}
              onChange={this.handleSearchChange}
            />
            <button type="submit" className="reagent-catalog-page__search-btn">
              Search
            </button>
          </form>
        </div>

        <section className="inventory-page__content">
          <ReagentCatalogTable
            reagents={reagents}
            loading={loading}
            error={error}
            onOpenReagent={this.openReagentModal}
          />
        </section>

        <ReagentDetailModal
          isOpen={reagentModalOpen}
          reagent={selectedReagentDetail}
          loading={reagentModalLoading}
          error={error}
          onClose={this.closeReagentModal}
          onOpenLot={this.openLotModal}
          onAddLotToCart={this.handleAddLotToCart}
          onCompositionSaved={this.handleCompositionSaved}
        />

        {selectedLot && (
          <InventoryDetailsModal
            isOpen={lotModalOpen}
            inventory={selectedLot}
            onClose={this.closeLotModal}
            loading={lotModalLoading}
            error={lotModalError}
            addToCart={addToCart}
          />
        )}
      </div>
    );
  }
}

export default ReagentCatalogPage;

