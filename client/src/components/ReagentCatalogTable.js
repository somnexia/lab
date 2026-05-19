import React, { Component } from 'react';

const KIND_LABELS = {
  element: 'Element',
  compound: 'Compound',
  mixture: 'Mixture',
};

class ReagentCatalogTable extends Component {
  formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—');

  formatOnHand = (reagent) => {
    const { stock } = reagent;
    if (!stock.inStock) {
      return '0';
    }

    const amount = stock.totalOnHand;
    return stock.unit ? `${amount} ${stock.unit}` : String(amount);
  };

  renderRows = () => {
    const { reagents, loading, error, onOpenReagent } = this.props;

    if (loading) {
      return (
        <tr>
          <td colSpan={8} className="reagent-catalog-table__state">Loading catalog…</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={8} className="reagent-catalog-table__state reagent-catalog-table__state--error">{error}</td>
        </tr>
      );
    }

    if (!reagents.length) {
      return (
        <tr>
          <td colSpan={8} className="reagent-catalog-table__state">No reagents match your filters.</td>
        </tr>
      );
    }

    return reagents.map((reagent) => (
      <tr key={`${reagent.kind}-${reagent.catalogId}`}>
        <td>
          <span className={`reagent-catalog-table__kind reagent-catalog-table__kind--${reagent.kind}`}>
            {KIND_LABELS[reagent.kind] || reagent.kind}
          </span>
        </td>
        <td>
          <button
            type="button"
            className="reagent-catalog-table__name"
            onClick={() => onOpenReagent(reagent)}
          >
            {reagent.name}
          </button>
        </td>
        <td>{reagent.formula || '—'}</td>
        <td>{reagent.casId || '—'}</td>
        <td>{reagent.aggregateState || '—'}</td>
        <td><strong>{this.formatOnHand(reagent)}</strong></td>
        <td>{reagent.stock.lotCount}</td>
        <td>{this.formatDate(reagent.stock.nearestExpiry)}</td>
      </tr>
    ));
  };

  render() {
    const { reagents, loading } = this.props;

    return (
      <div className="reagent-catalog-table-wrap">
        <div className="reagent-catalog-table__meta">
          <span>{loading ? '…' : `${reagents.length} catalog entries`}</span>
        </div>
        <table className="reagent-catalog-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Formula</th>
              <th>CAS</th>
              <th>State</th>
              <th>On hand</th>
              <th>Lots</th>
              <th>Nearest expiry</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </div>
    );
  }
}

export default ReagentCatalogTable;
