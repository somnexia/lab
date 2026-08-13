import React, { Component } from 'react';
import axios from 'axios';
import { API_BASE, API_CHEM_EQUIPMENTS, API_REAGENTS } from '../config/api';

const REAGENT_KINDS = [
  { id: 'element', label: 'Element' },
  { id: 'compound', label: 'Compound' },
  { id: 'mixture', label: 'Mixture' },
];

const emptyRow = () => ({
  key: `row-${Date.now()}-${Math.random()}`,
  inputRole: 'reagent',
  itemType: 'compound',
  referenceId: '',
  quantity: '',
  unitMeasure: 'g',
  notes: '',
});

class ExperimentInputEditor extends Component {
  state = {
    rows: [],
    catalogOptions: [],
    loadingCatalog: false,
    saving: false,
    error: null,
    success: null,
    editing: false,
  };

  componentDidMount() {
    this.syncFromProps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.inputs !== this.props.inputs) {
      this.syncFromProps();
    }
  }

  syncFromProps = () => {
    const { inputs = [] } = this.props;
    const rows = inputs.map((input, index) => ({
      key: `existing-${input.id || index}`,
      inputRole: input.inputRole || input.input_role || 'reagent',
      itemType: input.itemType || input.item_type || 'compound',
      referenceId: String(input.referenceId ?? input.reference_id ?? ''),
      quantity: input.quantity != null ? String(input.quantity) : '',
      unitMeasure: input.unitMeasure || input.unit_measure || 'g',
      notes: input.notes || '',
    }));
    this.setState({ rows, editing: false, error: null, success: null });
  };

  fetchCatalogOptions = async (inputRole, itemType) => {
    this.setState({ loadingCatalog: true });

    try {
      if (inputRole === 'equipment') {
        const response = await axios.get(API_CHEM_EQUIPMENTS);
        const catalogOptions = response.data.map((item) => ({
          id: item.id,
          label: `${item.name} (#${item.id})`,
        }));
        this.setState({ catalogOptions, loadingCatalog: false });
        return;
      }

      const response = await axios.get(API_REAGENTS, { params: { types: itemType } });
      const catalogOptions = response.data.map((item) => ({
        id: item.catalogId,
        label: `${item.name} (${item.casId || item.kind})`,
      }));
      this.setState({ catalogOptions, loadingCatalog: false });
    } catch (error) {
      console.error('Failed to load catalog:', error);
      this.setState({ catalogOptions: [], loadingCatalog: false });
    }
  };

  startEditing = () => {
    this.setState({ editing: true, error: null, success: null });
    const firstRow = this.state.rows[0];
    this.fetchCatalogOptions(
      firstRow?.inputRole || 'reagent',
      firstRow?.itemType || 'compound'
    );
  };

  cancelEditing = () => {
    this.syncFromProps();
  };

  handleRowChange = (key, field, value) => {
    this.setState((prev) => ({
      rows: prev.rows.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, [field]: value };

        if (field === 'inputRole') {
          next.itemType = value === 'equipment' ? 'equipment' : 'compound';
          next.referenceId = '';
          this.fetchCatalogOptions(value, next.itemType);
        }

        if (field === 'itemType') {
          next.referenceId = '';
          this.fetchCatalogOptions(next.inputRole, value);
        }

        return next;
      }),
      error: null,
    }));
  };

  addRow = () => {
    this.setState((prev) => ({
      rows: [...prev.rows, emptyRow()],
      editing: true,
    }));
    if (!this.state.catalogOptions.length) {
      this.fetchCatalogOptions('reagent', 'compound');
    }
  };

  removeRow = (key) => {
    this.setState((prev) => ({
      rows: prev.rows.filter((row) => row.key !== key),
    }));
  };

  buildPayload = () => {
    return this.state.rows
      .filter((row) => row.referenceId)
      .map((row, index) => ({
        inputRole: row.inputRole,
        itemType: row.inputRole === 'equipment' ? 'equipment' : row.itemType,
        referenceId: Number(row.referenceId),
        quantity: row.quantity !== '' ? Number(row.quantity) : null,
        unitMeasure: row.unitMeasure || null,
        notes: row.notes || null,
        sortOrder: index,
      }));
  };

  handleSave = async () => {
    const { experimentId, onSaved } = this.props;
    this.setState({ saving: true, error: null, success: null });

    try {
      const response = await axios.put(`${API_BASE}/experiments/${experimentId}/inputs`, {
        inputs: this.buildPayload(),
      });
      this.setState({ saving: false, editing: false, success: 'Inputs saved.' });
      if (onSaved) onSaved(response.data);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save inputs';
      this.setState({ saving: false, error: message });
    }
  };

  renderViewTable = () => {
    const { inputs = [] } = this.props;

    if (!inputs.length) {
      return <p className="experiment-input-editor__state">No inputs defined yet.</p>;
    }

    return (
      <table className="experiment-input-editor__table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Type</th>
            <th>Material</th>
            <th>Quantity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input) => (
            <tr key={input.id}>
              <td>{input.inputRole || input.input_role}</td>
              <td>{input.itemType || input.item_type}</td>
              <td>{input.catalogName || `#${input.referenceId ?? input.reference_id}`}</td>
              <td>
                {input.quantity != null
                  ? `${input.quantity}${input.unitMeasure || input.unit_measure ? ` ${input.unitMeasure || input.unit_measure}` : ''}`
                  : '—'}
              </td>
              <td>{input.notes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  renderEditorRows = () => {
    const { rows, catalogOptions, loadingCatalog } = this.state;

    return rows.map((row) => (
      <div className="experiment-input-editor__row" key={row.key}>
        <select
          value={row.inputRole}
          onChange={(e) => this.handleRowChange(row.key, 'inputRole', e.target.value)}
        >
          <option value="reagent">Reagent</option>
          <option value="equipment">Equipment</option>
        </select>

        {row.inputRole === 'reagent' ? (
          <select
            value={row.itemType}
            onChange={(e) => this.handleRowChange(row.key, 'itemType', e.target.value)}
          >
            {REAGENT_KINDS.map((kind) => (
              <option key={kind.id} value={kind.id}>{kind.label}</option>
            ))}
          </select>
        ) : (
          <span className="experiment-input-editor__fixed-type">equipment</span>
        )}

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

        <input
          type="number"
          min="0"
          step="any"
          placeholder="Qty"
          value={row.quantity}
          onChange={(e) => this.handleRowChange(row.key, 'quantity', e.target.value)}
        />

        <input
          type="text"
          placeholder="Unit"
          value={row.unitMeasure}
          onChange={(e) => this.handleRowChange(row.key, 'unitMeasure', e.target.value)}
        />

        <input
          type="text"
          placeholder="Notes"
          value={row.notes}
          onChange={(e) => this.handleRowChange(row.key, 'notes', e.target.value)}
        />

        <button type="button" className="experiment-input-editor__remove" onClick={() => this.removeRow(row.key)}>
          Remove
        </button>
      </div>
    ));
  };

  render() {
    const { editing, saving, error, success } = this.state;

    return (
      <div className="experiment-input-editor">
        <div className="experiment-input-editor__head">
          <h3>Inputs</h3>
          <p className="experiment-input-editor__hint">
            Reagents and equipment consumed in this experiment run (from the same catalog as inventory).
          </p>
        </div>

        {!editing ? (
          <>
            {this.renderViewTable()}
            <div className="experiment-input-editor__toolbar">
              <button type="button" className="experiment-input-editor__btn" onClick={this.startEditing}>
                Edit inputs
              </button>
              <button type="button" className="experiment-input-editor__btn experiment-input-editor__btn--ghost" onClick={this.addRow}>
                Add input
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="experiment-input-editor__rows">{this.renderEditorRows()}</div>
            <div className="experiment-input-editor__toolbar">
              <button
                type="button"
                className="experiment-input-editor__btn experiment-input-editor__btn--primary"
                onClick={this.handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save inputs'}
              </button>
              <button type="button" className="experiment-input-editor__btn" onClick={this.addRow}>
                Add row
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

export default ExperimentInputEditor;
