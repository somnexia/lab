import React, { Component } from 'react';

const KIND_LABELS = {
  element: 'Element',
  compound: 'Compound',
  mixture: 'Mixture',
};

class MixtureCompositionTable extends Component {
  formatAmount = (component) => {
    if (component.moleFraction != null) {
      return `${(component.moleFraction * 100).toFixed(2)}% mol`;
    }
    if (component.amount != null) {
      return component.amountUnit
        ? `${component.amount} ${component.amountUnit}`
        : String(component.amount);
    }
    return 'Qualitative';
  };

  renderFractionBar = () => {
    const { components } = this.props;
    const withFraction = components.filter((c) => c.moleFraction != null);
    if (!withFraction.length) {
      return null;
    }

    const sum = withFraction.reduce((acc, c) => acc + c.moleFraction, 0);

    return (
      <div className="mixture-composition__bar" aria-hidden="true">
        {withFraction.map((component) => (
          <span
            key={component.id || `${component.componentKind}-${component.componentId}`}
            className={`mixture-composition__bar-segment mixture-composition__bar-segment--${component.componentKind}`}
            style={{ flexGrow: component.moleFraction }}
            title={`${component.catalogName || component.componentKind}: ${(component.moleFraction * 100).toFixed(1)}%`}
          />
        ))}
        <span className="mixture-composition__bar-label">
          Mole fractions sum: {(sum * 100).toFixed(1)}%
        </span>
      </div>
    );
  };

  render() {
    const { components, loading, error, emptyMessage } = this.props;

    if (loading) {
      return <p className="mixture-composition__state">Loading composition…</p>;
    }

    if (error) {
      return <p className="mixture-composition__state mixture-composition__state--error">{error}</p>;
    }

    if (!components?.length) {
      return (
        <p className="mixture-composition__state">
          {emptyMessage || 'No structured components defined. See legacy composition text below.'}
        </p>
      );
    }

    return (
      <div className="mixture-composition">
        {this.renderFractionBar()}
        <div className="mixture-composition-table-wrap">
          <table className="mixture-composition-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Component</th>
                <th>Role</th>
                <th>Amount / fraction</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component, index) => (
                <tr key={component.id || `${component.componentKind}-${component.componentId}-${index}`}>
                  <td>{component.sortOrder ?? index}</td>
                  <td>
                    <span className={`reagent-catalog-table__kind reagent-catalog-table__kind--${component.componentKind}`}>
                      {KIND_LABELS[component.componentKind] || component.componentKind}
                    </span>
                  </td>
                  <td>
                    <strong>{component.catalogName || `#${component.componentId}`}</strong>
                    {component.catalogFormula && (
                      <span className="mixture-composition-table__meta"> {component.catalogFormula}</span>
                    )}
                    {component.catalogCas && (
                      <span className="mixture-composition-table__meta"> · CAS {component.catalogCas}</span>
                    )}
                  </td>
                  <td>{component.role || '—'}</td>
                  <td><strong>{this.formatAmount(component)}</strong></td>
                  <td className="mixture-composition-table__notes">{component.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default MixtureCompositionTable;

