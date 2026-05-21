import React, { Component } from 'react';
import InventoryTable from './InventoryTable';
import MixtureCompositionTable from './MixtureCompositionTable';
import { enrichInventoryLots } from '../utils/inventoryEnrichment';

const KIND_LABELS = {
  element: 'Element',
  compound: 'Compound',
  mixture: 'Mixture',
};

class ReagentDetailModal extends Component {
  handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      this.props.onClose();
    }
  };

  renderCatalogBlock = () => {
    const { reagent } = this.props;
    if (!reagent) return null;

    return (
      <section className="reagent-detail-modal__catalog">
        <div className="reagent-detail-modal__catalog-head">
          <span className={`reagent-catalog-table__kind reagent-catalog-table__kind--${reagent.kind}`}>
            {KIND_LABELS[reagent.kind]}
          </span>
          <h2 id="reagent-detail-title">{reagent.name}</h2>
        </div>
        <dl className="reagent-detail-modal__facts">
          <div>
            <dt>CAS</dt>
            <dd>{reagent.casId || '—'}</dd>
          </div>
          <div>
            <dt>Formula</dt>
            <dd>{reagent.formula || '—'}</dd>
          </div>
          <div>
            <dt>Aggregate state</dt>
            <dd>{reagent.aggregateState || '—'}</dd>
          </div>
          <div>
            <dt>On hand</dt>
            <dd>
              {reagent.stock.inStock
                ? `${reagent.stock.totalOnHand}${reagent.stock.unit ? ` ${reagent.stock.unit}` : ''}`
                : 'No stock'}
            </dd>
          </div>
          <div>
            <dt>Lots</dt>
            <dd>{reagent.stock.lotCount}</dd>
          </div>
        </dl>
        {reagent.kind === 'mixture' && (
          <div className="reagent-detail-modal__composition">
            <h3>Structured composition</h3>
            <MixtureCompositionTable
              components={reagent.components}
              emptyMessage="No structured components yet."
            />
            {reagent.composition && (
              <div className="reagent-detail-modal__composition-summary">
                <h4>Composition summary (catalog text)</h4>
                <p>{reagent.composition}</p>
              </div>
            )}
          </div>
        )}
        {reagent.description && (
          <div className="reagent-detail-modal__description">
            <h3>Description</h3>
            <p>{reagent.description}</p>
          </div>
        )}
      </section>
    );
  };

  render() {
    const { isOpen, reagent, loading, error, onClose, onOpenLot, onAddLotToCart } = this.props;

    if (!isOpen) {
      return null;
    }

    const lots = enrichInventoryLots(reagent?.lots || []);

    return (
      <div
        className="reagent-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reagent-detail-title"
        onClick={this.handleBackdropClick}
      >
        <div className="reagent-detail-modal__panel">
          <header className="reagent-detail-modal__header">
            <p className="inventory-page__eyebrow">Reagent catalog</p>
            <button type="button" className="reagent-detail-modal__close" onClick={onClose}>
              Close
            </button>
          </header>

          {loading && <p className="reagent-detail-modal__state">Loading reagent…</p>}
          {error && <p className="reagent-detail-modal__state reagent-detail-modal__state--error">{error}</p>}

          {!loading && !error && reagent && (
            <>
              {this.renderCatalogBlock()}
              <section className="reagent-detail-modal__lots">
                <h3>Stock lots</h3>
                <p className="reagent-detail-modal__lots-hint">
                  Physical batches linked to this catalog entry. Actions apply to a specific lot.
                </p>
                <InventoryTable
                  inventories={lots}
                  loading={false}
                  showActions={Boolean(onOpenLot || onAddLotToCart)}
                  onOpenDetails={onOpenLot}
                  onAddToCart={onAddLotToCart}
                  useCatalogLabels
                />
              </section>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default ReagentDetailModal;

