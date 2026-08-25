import React, { Component } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * Миграция на http-клиент для outputs эксперимента.
 * Проверка:
 * - GET /api/reagents?types=...
 * - PUT /api/experiments/:id/outputs
 */

const PRODUCT_KINDS = [
  { id: 'element', label: 'Element' },
  { id: 'compound', label: 'Compound' },
  { id: 'mixture', label: 'Mixture' },
];

const PRODUCT_UNITS = ['g', 'mg', 'ml', 'L', 'mol', 'mmol'];

const emptyRow = () => ({
  key: `row-${Date.now()}-${Math.random()}`,
  itemType: 'compound',
  referenceId: '',
  resultItemName: '',
  quantity: '',
  unitMeasure: 'g',
  notes: '',
});

const formatAmount = (output) => {
  if (output.quantity == null) return '—';
  const unit = output.unitMeasure || output.unit_measure;
  return unit ? `${output.quantity} ${unit}` : String(output.quantity);
};

const resolveProductName = (output) =>
  output.catalogName || output.resultItemName || output.result_item_name || '—';

class ExperimentOutputEditor extends Component {
  state = {
    rows: [],
    catalogOptionsByKey: {},
    loadingCatalogKey: null,
    saving: false,
    error: null,
    success: null,
    editing: false,
  };

  componentDidMount() {
    this.syncFromProps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.outputs !== this.props.outputs) {
      this.syncFromProps();
    }
  }

  syncFromProps = () => {
    const { outputs = [] } = this.props;
    const rows = outputs.map((output, index) => ({
      key: `existing-${output.id || index}`,
      itemType: output.itemType || output.item_type || 'compound',
      referenceId: String(output.referenceId ?? output.reference_id ?? ''),
      resultItemName: output.resultItemName || output.result_item_name || '',
      quantity: output.quantity != null ? String(output.quantity) : '',
      unitMeasure: output.unitMeasure || output.unit_measure || 'g',
      notes: output.notes || '',
    }));
    this.setState({ rows, editing: false, error: null, success: null, catalogOptionsByKey: {} });
  };

  fetchCatalogOptions = async (rowKey, itemType) => {
    this.setState({ loadingCatalogKey: rowKey });

    try {
      const response = await http.get(API.reagents, { params: { types: itemType } });
      const catalogOptions = response.data.map((item) => ({
        id: item.catalogId,
        name: item.name,
        label: `${item.name} (${item.casId || item.kind})`,
      }));
      this.setState((prev) => ({
        catalogOptionsByKey: { ...prev.catalogOptionsByKey, [rowKey]: catalogOptions },
        loadingCatalogKey: null,
      }));
    } catch (error) {
      console.error('Failed to load catalog:', error);
      this.setState((prev) => ({
        catalogOptionsByKey: { ...prev.catalogOptionsByKey, [rowKey]: [] },
        loadingCatalogKey: null,
      }));
    }
  };

  ensureCatalogLoaded = (row) => {
    if (!this.state.catalogOptionsByKey[row.key]) {
      this.fetchCatalogOptions(row.key, row.itemType);
    }
  };

  startEditing = () => {
    this.setState({ editing: true, error: null, success: null });
    this.state.rows.forEach((row) => this.ensureCatalogLoaded(row));
  };

  cancelEditing = () => {
    this.syncFromProps();
  };

  resolveResultName = (rowKey, referenceId, itemType) => {
    const options = this.state.catalogOptionsByKey[rowKey] || [];
    const match = options.find((item) => String(item.id) === String(referenceId));
    if (match) return match.name;

    const row = this.state.rows.find((item) => item.key === rowKey);
    if (row?.resultItemName) return row.resultItemName;

    return referenceId ? `Product #${referenceId}` : '';
  };

  handleRowChange = (key, field, value) => {
    this.setState((prev) => ({
      rows: prev.rows.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, [field]: value };

        if (field === 'itemType') {
          next.referenceId = '';
          next.resultItemName = '';
          this.fetchCatalogOptions(key, value);
        }

        if (field === 'referenceId') {
          const options = prev.catalogOptionsByKey[key] || [];
          const match = options.find((item) => String(item.id) === String(value));
          next.resultItemName = match?.name || '';
        }

        return next;
      }),
      error: null,
    }));
  };

  addRow = () => {
    const row = emptyRow();
    this.setState((prev) => ({
      rows: [...prev.rows, row],
      editing: true,
    }));
    this.fetchCatalogOptions(row.key, row.itemType);
  };

  removeRow = (key) => {
    this.setState((prev) => ({
      rows: prev.rows.filter((row) => row.key !== key),
      catalogOptionsByKey: Object.fromEntries(
        Object.entries(prev.catalogOptionsByKey).filter(([rowKey]) => rowKey !== key)
      ),
    }));
  };

  buildPayload = () =>
    this.state.rows
      .filter((row) => row.referenceId || row.resultItemName.trim())
      .map((row, index) => {
        const resultItemName = row.resultItemName.trim()
          || this.resolveResultName(row.key, row.referenceId, row.itemType);

        return {
          itemType: row.itemType,
          referenceId: row.referenceId ? Number(row.referenceId) : null,
          resultItemName,
          quantity: row.quantity !== '' ? Number(row.quantity) : null,
          unitMeasure: row.unitMeasure || null,
          notes: row.notes || null,
          sortOrder: index,
        };
      });

  handleSave = async () => {
    const { experimentId, onSaved } = this.props;
    const payload = this.buildPayload();
    const missingName = payload.find((row) => !row.resultItemName);

    if (missingName) {
      this.setState({ error: 'Each output needs a product selected from the catalog.' });
      return;
    }

    this.setState({ saving: true, error: null, success: null });

    try {
      const response = await http.put(`${API.experiments}/${experimentId}/outputs`, {
        outputs: payload,
      });
      this.setState({ saving: false, editing: false, success: 'Outputs saved.' });
      if (onSaved) onSaved(response.data);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save outputs';
      this.setState({ saving: false, error: message });
    }
  };

  renderViewSection = () => {
    const { outputs = [] } = this.props;

    if (!outputs.length) {
      return <p className="experiment-input-editor__state">No expected products defined yet.</p>;
    }

    return (
      <table className="experiment-input-editor__table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Product</th>
            <th>Expected amount</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {outputs.map((output) => (
            <tr key={output.id}>
              <td>{output.itemType || output.item_type}</td>
              <td>{resolveProductName(output)}</td>
              <td>{formatAmount(output)}</td>
              <td>{output.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  renderField = (label, control) => (
    <label className="experiment-input-editor__field">
      <span className="experiment-input-editor__field-label">{label}</span>
      {control}
    </label>
  );

  renderEditorRows = () => {
    const { rows, catalogOptionsByKey, loadingCatalogKey } = this.state;

    if (!rows.length) {
      return <p className="experiment-input-editor__state">No product rows yet.</p>;
    }

    return rows.map((row) => {
      const catalogOptions = catalogOptionsByKey[row.key] || [];
      const loadingCatalog = loadingCatalogKey === row.key;

      return (
        <div className="experiment-input-editor__row experiment-input-editor__row--reagent experiment-output-editor__row" key={row.key}>
          <div className="experiment-input-editor__row-badge experiment-output-editor__row-badge">Product</div>

          {this.renderField(
            'Kind',
            <select
              value={row.itemType}
              onChange={(e) => this.handleRowChange(row.key, 'itemType', e.target.value)}
            >
              {PRODUCT_KINDS.map((kind) => (
                <option key={kind.id} value={kind.id}>{kind.label}</option>
              ))}
            </select>
          )}

          {this.renderField(
            'Product',
            <select
              value={row.referenceId}
              onChange={(e) => this.handleRowChange(row.key, 'referenceId', e.target.value)}
              disabled={loadingCatalog}
            >
              <option value="">{loadingCatalog ? 'Loading…' : 'Select from catalog…'}</option>
              {catalogOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          )}

          {this.renderField(
            'Expected amount',
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Optional until run"
              value={row.quantity}
              onChange={(e) => this.handleRowChange(row.key, 'quantity', e.target.value)}
            />
          )}

          {this.renderField(
            'Unit',
            <select
              value={row.unitMeasure}
              onChange={(e) => this.handleRowChange(row.key, 'unitMeasure', e.target.value)}
            >
              {PRODUCT_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          )}

          {this.renderField(
            'Notes',
            <input
              type="text"
              placeholder="Optional"
              value={row.notes}
              onChange={(e) => this.handleRowChange(row.key, 'notes', e.target.value)}
            />
          )}

          <button type="button" className="experiment-input-editor__remove" onClick={() => this.removeRow(row.key)}>
            Remove
          </button>
        </div>
      );
    });
  };

  render() {
    const { editing, saving, error, success } = this.state;

    return (
      <div className="experiment-output-editor">
        <div className="experiment-input-editor__head">
          <h3>Outputs</h3>
          <p className="experiment-input-editor__hint">
            Expected products after the run. Pick items from the same reagent catalog as inputs.
          </p>
        </div>

        {!editing ? (
          <>
            <section className="experiment-input-editor__section">
              <h4 className="experiment-input-editor__section-title">Expected products</h4>
              <p className="experiment-input-editor__section-hint">
                Planned yields before simulation or execution.
              </p>
              {this.renderViewSection()}
            </section>
            <div className="experiment-input-editor__toolbar">
              <button type="button" className="experiment-input-editor__btn" onClick={this.startEditing}>
                Edit outputs
              </button>
              <button type="button" className="experiment-input-editor__btn experiment-input-editor__btn--ghost" onClick={this.addRow}>
                Add product
              </button>
            </div>
          </>
        ) : (
          <>
            <section className="experiment-input-editor__section">
              <h4 className="experiment-input-editor__section-title">Expected products</h4>
              <p className="experiment-input-editor__section-hint">
                Amount can stay empty until a simulation calculates yield.
              </p>
              <div className="experiment-input-editor__rows">{this.renderEditorRows()}</div>
            </section>
            <div className="experiment-input-editor__toolbar">
              <button
                type="button"
                className="experiment-input-editor__btn experiment-input-editor__btn--primary"
                onClick={this.handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save outputs'}
              </button>
              <button type="button" className="experiment-input-editor__btn" onClick={this.addRow}>
                Add product
              </button>
              <button type="button" className="experiment-input-editor__btn experiment-input-editor__btn--ghost" onClick={this.cancelEditing}>
                Cancel
              </button>
            </div>
          </>
        )}

        {error && <p className="experiment-input-editor__message experiment-input-editor__message--error">{error}</p>}
        {success && <p className="experiment-input-editor__message experiment-input-editor__message--success">{success}</p>}
      </div>
    );
  }
}

export default ExperimentOutputEditor;
