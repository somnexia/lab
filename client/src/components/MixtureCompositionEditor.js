import React, { Component } from 'react';
import MixtureCompositionTable from './MixtureCompositionTable';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * MixtureCompositionEditor — состав смеси (пункт 5).
 * Было: axios + абсолютные API_REAGENTS / API_CHEM_MIXTURES
 * Стало: http + API.reagents / API.chemMixtures
 * Проверить: Save composition → PUT /api/chemMixtures/:id/components
 */
const COMPONENT_KINDS = [
  { id: 'element', label: 'Element' },
  { id: 'compound', label: 'Compound' },
  { id: 'mixture', label: 'Mixture' },
];

const ROLE_OPTIONS = ['', 'solvent', 'solute', 'catalyst', 'buffer', 'other'];

const emptyRow = () => ({
  key: `row-${Date.now()}-${Math.random()}`,
  componentKind: 'compound',
  componentId: '',
  componentLabel: '',
  role: '',
  amountType: 'mole_fraction',
  amount: '',
  amountUnit: 'g',
  moleFraction: '',
  notes: '',
});

class MixtureCompositionEditor extends Component {
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
    if (prevProps.components !== this.props.components) {
      this.syncFromProps();
    }
  }

  syncFromProps = () => {
    const { components = [] } = this.props;
    const rows = components.map((component, index) => ({
      key: `existing-${component.id || index}`,
      componentKind: component.componentKind,
      componentId: String(component.componentId),
      componentLabel: component.catalogName || `#${component.componentId}`,
      role: component.role || '',
      amountType: component.moleFraction != null ? 'mole_fraction' : (component.amount != null ? 'amount' : 'qualitative'),
      amount: component.amount != null ? String(component.amount) : '',
      amountUnit: component.amountUnit || 'g',
      moleFraction: component.moleFraction != null ? String(component.moleFraction) : '',
      notes: component.notes || '',
    }));
    this.setState({ rows, editing: false, error: null, success: null });
  };

  fetchCatalogOptions = async (kind) => {
    this.setState({ loadingCatalog: true });
    try {
      const response = await http.get(API.reagents, { params: { types: kind } });
      const catalogOptions = response.data
        .filter((item) => !(kind === 'mixture' && Number(item.catalogId) === Number(this.props.mixtureId)))
        .map((item) => ({
          id: item.catalogId,
          label: `${item.name} (${item.casId || item.kind})`,
          name: item.name,
        }));
      this.setState({ catalogOptions, loadingCatalog: false });
    } catch (error) {
      console.error('Failed to load catalog:', error);
      this.setState({ catalogOptions: [], loadingCatalog: false });
    }
  };

  startEditing = () => {
    this.setState({ editing: true, error: null, success: null });
    const firstKind = this.state.rows[0]?.componentKind || 'compound';
    this.fetchCatalogOptions(firstKind);
  };

  cancelEditing = () => {
    this.syncFromProps();
  };

  handleRowChange = (key, field, value) => {
    this.setState((prev) => ({
      rows: prev.rows.map((row) => {
        if (row.key !== key) return row;
        const next = { ...row, [field]: value };
        if (field === 'componentKind') {
          next.componentId = '';
          next.componentLabel = '';
          this.fetchCatalogOptions(value);
        }
        if (field === 'componentId') {
          const selected = this.state.catalogOptions.find((item) => String(item.id) === String(value));
          next.componentLabel = selected?.name || '';
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
      this.fetchCatalogOptions('compound');
    }
  };

  removeRow = (key) => {
    this.setState((prev) => ({
      rows: prev.rows.filter((row) => row.key !== key),
    }));
  };

  buildPayload = () => {
    return this.state.rows
      .filter((row) => row.componentId)
      .map((row, index) => {
        const base = {
          componentKind: row.componentKind,
          componentId: Number(row.componentId),
          role: row.role || '',
          sortOrder: index,
          notes: row.notes || null,
        };

        if (row.amountType === 'mole_fraction' && row.moleFraction !== '') {
          return { ...base, moleFraction: Number(row.moleFraction) };
        }

        if (row.amountType === 'amount' && row.amount !== '') {
          return {
            ...base,
            amount: Number(row.amount),
            amountUnit: row.amountUnit || null,
          };
        }

        return base;
      });
  };

  handleSave = async () => {
    const { mixtureId, onSaved } = this.props;
    this.setState({ saving: true, error: null, success: null });

    try {
      const response = await http.put(`${API.chemMixtures}/${mixtureId}/components`, {
        syncCompositionText: true,
        components: this.buildPayload(),
      });
      this.setState({
        saving: false,
        editing: false,
        success: 'Composition saved.',
      });
      if (onSaved) {
        onSaved(response.data);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save composition';
      this.setState({ saving: false, error: message });
    }
  };

  renderEditorRows = () => {
    const { rows, catalogOptions, loadingCatalog } = this.state;

    return rows.map((row) => (
      <div className="mixture-composition-editor__row" key={row.key}>
        <select
          value={row.componentKind}
          onChange={(e) => this.handleRowChange(row.key, 'componentKind', e.target.value)}
        >
          {COMPONENT_KINDS.map((kind) => (
            <option key={kind.id} value={kind.id}>{kind.label}</option>
          ))}
        </select>

        <select
          value={row.componentId}
          onChange={(e) => this.handleRowChange(row.key, 'componentId', e.target.value)}
          disabled={loadingCatalog}
        >
          <option value="">{loadingCatalog ? 'Loading…' : 'Select component…'}</option>
          {catalogOptions
            .filter((item) => row.componentKind !== 'mixture' || Number(item.id) !== Number(this.props.mixtureId))
            .map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
        </select>

        <select
          value={row.role}
          onChange={(e) => this.handleRowChange(row.key, 'role', e.target.value)}
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role || 'none'} value={role}>{role || 'No role'}</option>
          ))}
        </select>

        <select
          value={row.amountType}
          onChange={(e) => this.handleRowChange(row.key, 'amountType', e.target.value)}
        >
          <option value="qualitative">Qualitative</option>
          <option value="amount">Amount</option>
          <option value="mole_fraction">Mole fraction</option>
        </select>

        {row.amountType === 'amount' && (
          <>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Amount"
              value={row.amount}
              onChange={(e) => this.handleRowChange(row.key, 'amount', e.target.value)}
            />
            <input
              type="text"
              placeholder="Unit"
              value={row.amountUnit}
              onChange={(e) => this.handleRowChange(row.key, 'amountUnit', e.target.value)}
            />
          </>
        )}

        {row.amountType === 'mole_fraction' && (
          <input
            type="number"
            min="0"
            max="1"
            step="0.0001"
            placeholder="0–1"
            value={row.moleFraction}
            onChange={(e) => this.handleRowChange(row.key, 'moleFraction', e.target.value)}
          />
        )}

        <input
          type="text"
          placeholder="Notes"
          value={row.notes}
          onChange={(e) => this.handleRowChange(row.key, 'notes', e.target.value)}
        />

        <button type="button" className="mixture-composition-editor__remove" onClick={() => this.removeRow(row.key)}>
          Remove
        </button>
      </div>
    ));
  };

  render() {
    const { components, readOnly } = this.props;
    const { editing, saving, error, success } = this.state;

    if (readOnly) {
      return <MixtureCompositionTable components={components} />;
    }

    return (
      <div className="mixture-composition-editor">
        {!editing ? (
          <>
            <MixtureCompositionTable
              components={components}
              emptyMessage="No structured components yet. Use Edit composition to define ingredients."
            />
            <div className="mixture-composition-editor__toolbar">
              <button type="button" className="mixture-composition-editor__btn" onClick={this.startEditing}>
                Edit composition
              </button>
              <button type="button" className="mixture-composition-editor__btn mixture-composition-editor__btn--ghost" onClick={this.addRow}>
                Add component
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mixture-composition-editor__rows">
              {this.renderEditorRows()}
            </div>
            <div className="mixture-composition-editor__toolbar">
              <button
                type="button"
                className="mixture-composition-editor__btn mixture-composition-editor__btn--primary"
                onClick={this.handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save composition'}
              </button>
              <button type="button" className="mixture-composition-editor__btn" onClick={this.addRow}>
                Add row
              </button>
              <button type="button" className="mixture-composition-editor__btn mixture-composition-editor__btn--ghost" onClick={this.cancelEditing}>
                Cancel
              </button>
            </div>
          </>
        )}

        {error && <p className="mixture-composition-editor__message mixture-composition-editor__message--error">{error}</p>}
        {success && <p className="mixture-composition-editor__message mixture-composition-editor__message--success">{success}</p>}
      </div>
    );
  }
}

export default MixtureCompositionEditor;
