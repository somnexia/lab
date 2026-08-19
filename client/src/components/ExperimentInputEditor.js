import React, { Component } from 'react';
import { API, API_CHEM_EQUIPMENTS, API_INVENTORIES, API_REAGENTS } from '../config/api';
import { http } from '../config/http';

/**
 * Миграция на http-клиент:
 * - чтение каталога/лотов и сохранение inputs идут через http.
 * Проверка:
 * - GET /api/inventories/filter
 * - GET /api/reagents?types=...
 * - PUT /api/experiments/:id/inputs
 */

const REAGENT_KINDS = [
  { id: 'element', label: 'Element' },
  { id: 'compound', label: 'Compound' },
  { id: 'mixture', label: 'Mixture' },
];

const REAGENT_UNITS = ['g', 'mg', 'ml', 'L', 'mol', 'mmol'];

const EQUIPMENT_UNITS = [
  { id: 'h', label: 'hours' },
  { id: 'min', label: 'minutes' },
  { id: 'uses', label: 'uses' },
  { id: 'session', label: 'session' },
];

const emptyReagentRow = () => ({
  key: `row-${Date.now()}-${Math.random()}`,
  inputRole: 'reagent',
  itemType: 'compound',
  referenceId: '',
  inventoryId: '',
  quantity: '',
  unitMeasure: 'g',
  notes: '',
});

const emptyEquipmentRow = () => ({
  key: `row-${Date.now()}-${Math.random()}`,
  inputRole: 'equipment',
  itemType: 'equipment',
  referenceId: '',
  quantity: '',
  unitMeasure: 'h',
  notes: '',
});

const isEquipmentInput = (input) =>
  (input.inputRole || input.input_role) === 'equipment';

const formatAmount = (input) => {
  if (input.quantity == null) return '—';
  const unit = input.unitMeasure || input.unit_measure;
  return unit ? `${input.quantity} ${unit}` : String(input.quantity);
};

const formatUsage = (input) => {
  if (input.quantity == null) {
    return input.notes ? `— (${input.notes})` : '—';
  }
  const unit = input.unitMeasure || input.unit_measure;
  const unitLabel = EQUIPMENT_UNITS.find((item) => item.id === unit)?.label || unit;
  return unit ? `${input.quantity} ${unitLabel}` : String(input.quantity);
};

const formatLotSummary = (input) => {
  if (input.inventoryLotLabel) return input.inventoryLotLabel;
  if (input.inventoryId || input.inventory_id) return `Lot #${input.inventoryId ?? input.inventory_id}`;
  return 'Any lot (aggregate)';
};

class ExperimentInputEditor extends Component {
  state = {
    rows: [],
    catalogOptionsByKey: {},
    lotOptionsByKey: {},
    loadingCatalogKey: null,
    loadingLotKey: null,
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
      inventoryId: String(input.inventoryId ?? input.inventory_id ?? ''),
      quantity: input.quantity != null ? String(input.quantity) : '',
      unitMeasure: input.unitMeasure || input.unit_measure || (isEquipmentInput(input) ? 'h' : 'g'),
      notes: input.notes || '',
    }));
    this.setState({ rows, editing: false, error: null, success: null, catalogOptionsByKey: {}, lotOptionsByKey: {} });
  };

  fetchLotOptions = async (rowKey, itemType, referenceId) => {
    if (!referenceId) {
      this.setState((prev) => ({
        lotOptionsByKey: { ...prev.lotOptionsByKey, [rowKey]: [] },
      }));
      return;
    }

    this.setState({ loadingLotKey: rowKey });

    try {
      const response = await http.get(`${API_INVENTORIES}/filter`, {
        params: { reference_id: referenceId, item_type: itemType },
      });
      const lotOptions = response.data.map((lot) => {
        const onHand = lot.total_quantity ?? lot.substance_amount ?? 0;
        const unit = lot.unit_measure ? ` ${lot.unit_measure}` : '';
        const status = lot.status ? ` · ${lot.status}` : '';
        return {
          id: lot.id,
          label: `Lot #${lot.id} · ${onHand}${unit}${status}`,
        };
      });
      this.setState((prev) => ({
        lotOptionsByKey: { ...prev.lotOptionsByKey, [rowKey]: lotOptions },
        loadingLotKey: null,
      }));
    } catch (error) {
      console.error('Failed to load lots:', error);
      this.setState((prev) => ({
        lotOptionsByKey: { ...prev.lotOptionsByKey, [rowKey]: [] },
        loadingLotKey: null,
      }));
    }
  };

  fetchCatalogOptions = async (rowKey, inputRole, itemType) => {
    this.setState({ loadingCatalogKey: rowKey });

    try {
      if (inputRole === 'equipment') {
        const response = await http.get(API_CHEM_EQUIPMENTS);
        const catalogOptions = response.data.map((item) => ({
          id: item.id,
          label: `${item.name} (#${item.id})`,
        }));
        this.setState((prev) => ({
          catalogOptionsByKey: { ...prev.catalogOptionsByKey, [rowKey]: catalogOptions },
          loadingCatalogKey: null,
        }));
        return;
      }

      const response = await http.get(API_REAGENTS, { params: { types: itemType } });
      const catalogOptions = response.data.map((item) => ({
        id: item.catalogId,
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
      this.fetchCatalogOptions(row.key, row.inputRole, row.itemType);
    }
    if (row.inputRole === 'reagent' && row.referenceId && !this.state.lotOptionsByKey[row.key]) {
      this.fetchLotOptions(row.key, row.itemType, row.referenceId);
    }
  };

  startEditing = () => {
    this.setState({ editing: true, error: null, success: null });
    this.state.rows.forEach((row) => this.ensureCatalogLoaded(row));
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
          if (value === 'equipment') {
            next.itemType = 'equipment';
            next.unitMeasure = 'h';
          } else {
            next.itemType = 'compound';
            next.unitMeasure = 'g';
          }
          next.referenceId = '';
          next.inventoryId = '';
          next.quantity = '';
          this.fetchCatalogOptions(key, value, next.itemType);
        }

        if (field === 'itemType') {
          next.referenceId = '';
          next.inventoryId = '';
          this.fetchCatalogOptions(key, next.inputRole, value);
        }

        if (field === 'referenceId') {
          next.inventoryId = '';
          if (next.inputRole === 'reagent') {
            this.fetchLotOptions(key, next.itemType, value);
          }
        }

        return next;
      }),
      error: null,
    }));
  };

  addRow = (inputRole = 'reagent') => {
    const row = inputRole === 'equipment' ? emptyEquipmentRow() : emptyReagentRow();
    this.setState((prev) => ({
      rows: [...prev.rows, row],
      editing: true,
    }));
    this.fetchCatalogOptions(row.key, row.inputRole, row.itemType);
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
      .filter((row) => row.referenceId)
      .map((row, index) => ({
        inputRole: row.inputRole,
        itemType: row.inputRole === 'equipment' ? 'equipment' : row.itemType,
        referenceId: Number(row.referenceId),
        inventoryId: row.inventoryId ? Number(row.inventoryId) : null,
        quantity: row.quantity !== '' ? Number(row.quantity) : null,
        unitMeasure: row.inputRole === 'equipment' && row.quantity === '' ? null : (row.unitMeasure || null),
        notes: row.notes || null,
        sortOrder: index,
      }));

  handleSave = async () => {
    const { experimentId, onSaved } = this.props;
    this.setState({ saving: true, error: null, success: null });

    try {
      const response = await http.put(`${API.experiments}/${experimentId}/inputs`, {
        inputs: this.buildPayload(),
      });
      const success = response.data.runInvalidated
        ? 'Inputs saved. Previous run was reset and stock restored — run again to consume.'
        : 'Inputs saved.';
      this.setState({ saving: false, editing: false, success });
      if (onSaved) onSaved(response.data);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save inputs';
      this.setState({ saving: false, error: message });
    }
  };

  renderViewSection = (title, hint, inputs, columns, renderRow) => {
    if (!inputs.length) {
      return (
        <section className="experiment-input-editor__section">
          <h4 className="experiment-input-editor__section-title">{title}</h4>
          <p className="experiment-input-editor__section-hint">{hint}</p>
          <p className="experiment-input-editor__state">None added yet.</p>
        </section>
      );
    }

    return (
      <section className="experiment-input-editor__section">
        <h4 className="experiment-input-editor__section-title">{title}</h4>
        <p className="experiment-input-editor__section-hint">{hint}</p>
        <table className="experiment-input-editor__table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>{inputs.map(renderRow)}</tbody>
        </table>
      </section>
    );
  };

  renderViewTables = () => {
    const { inputs = [] } = this.props;
    const reagents = inputs.filter((input) => !isEquipmentInput(input));
    const equipment = inputs.filter(isEquipmentInput);

    if (!inputs.length) {
      return <p className="experiment-input-editor__state">No inputs defined yet.</p>;
    }

    return (
      <>
        {this.renderViewSection(
          'Reagents',
          'Materials consumed with mass or volume.',
          reagents,
          ['Type', 'Material', 'Lot', 'Amount', 'Notes'],
          (input) => (
            <tr key={input.id}>
              <td>{input.itemType || input.item_type}</td>
              <td>{input.catalogName || `#${input.referenceId ?? input.reference_id}`}</td>
              <td>{formatLotSummary(input)}</td>
              <td>{formatAmount(input)}</td>
              <td>{input.notes || '—'}</td>
            </tr>
          )
        )}
        {this.renderViewSection(
          'Equipment',
          'Instruments used during the run (duration or usage, not mass).',
          equipment,
          ['Equipment', 'Usage', 'Notes'],
          (input) => (
            <tr key={input.id}>
              <td>{input.catalogName || `#${input.referenceId ?? input.reference_id}`}</td>
              <td>{formatUsage(input)}</td>
              <td>{input.notes || '—'}</td>
            </tr>
          )
        )}
      </>
    );
  };

  renderField = (label, control) => (
    <label className="experiment-input-editor__field">
      <span className="experiment-input-editor__field-label">{label}</span>
      {control}
    </label>
  );

  renderReagentRow = (row) => {
    const { catalogOptionsByKey, lotOptionsByKey, loadingCatalogKey, loadingLotKey } = this.state;
    const catalogOptions = catalogOptionsByKey[row.key] || [];
    const lotOptions = lotOptionsByKey[row.key] || [];
    const loadingCatalog = loadingCatalogKey === row.key;
    const loadingLots = loadingLotKey === row.key;

    return (
      <div className="experiment-input-editor__row experiment-input-editor__row--reagent" key={row.key}>
        <div className="experiment-input-editor__row-badge">Reagent</div>

        {this.renderField(
          'Kind',
          <select
            value={row.itemType}
            onChange={(e) => this.handleRowChange(row.key, 'itemType', e.target.value)}
          >
            {REAGENT_KINDS.map((kind) => (
              <option key={kind.id} value={kind.id}>{kind.label}</option>
            ))}
          </select>
        )}

        {this.renderField(
          'Material',
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
          'Stock lot',
          <select
            value={row.inventoryId}
            onChange={(e) => this.handleRowChange(row.key, 'inventoryId', e.target.value)}
            disabled={!row.referenceId || loadingLots}
          >
            <option value="">
              {!row.referenceId
                ? 'Select material first…'
                : loadingLots
                  ? 'Loading lots…'
                  : 'Any lot (aggregate check)'}
            </option>
            {lotOptions.map((lot) => (
              <option key={lot.id} value={lot.id}>{lot.label}</option>
            ))}
          </select>
        )}

        {this.renderField(
          'Amount',
          <input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
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
            {REAGENT_UNITS.map((unit) => (
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
  };

  renderEquipmentRow = (row) => {
    const { catalogOptionsByKey, loadingCatalogKey } = this.state;
    const catalogOptions = catalogOptionsByKey[row.key] || [];
    const loadingCatalog = loadingCatalogKey === row.key;

    return (
      <div className="experiment-input-editor__row experiment-input-editor__row--equipment" key={row.key}>
        <div className="experiment-input-editor__row-badge experiment-input-editor__row-badge--equipment">Equipment</div>

        {this.renderField(
          'Equipment',
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
          'Duration',
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Optional"
            value={row.quantity}
            onChange={(e) => this.handleRowChange(row.key, 'quantity', e.target.value)}
          />
        )}

        {this.renderField(
          'Usage unit',
          <select
            value={row.unitMeasure}
            onChange={(e) => this.handleRowChange(row.key, 'unitMeasure', e.target.value)}
          >
            {EQUIPMENT_UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.label}</option>
            ))}
          </select>
        )}

        {this.renderField(
          'Notes',
          <input
            type="text"
            placeholder="e.g. 4000 rpm, step 2"
            value={row.notes}
            onChange={(e) => this.handleRowChange(row.key, 'notes', e.target.value)}
          />
        )}

        <button type="button" className="experiment-input-editor__remove" onClick={() => this.removeRow(row.key)}>
          Remove
        </button>
      </div>
    );
  };

  renderEditorRows = () => {
    const { rows } = this.state;
    const reagentRows = rows.filter((row) => row.inputRole === 'reagent');
    const equipmentRows = rows.filter((row) => row.inputRole === 'equipment');

    return (
      <>
        <section className="experiment-input-editor__section">
          <h4 className="experiment-input-editor__section-title">Reagents</h4>
          <p className="experiment-input-editor__section-hint">Specify mass or volume; optionally pin a warehouse lot.</p>
          <div className="experiment-input-editor__rows">
            {reagentRows.length ? reagentRows.map((row) => this.renderReagentRow(row)) : (
              <p className="experiment-input-editor__state">No reagent rows yet.</p>
            )}
          </div>
        </section>

        <section className="experiment-input-editor__section">
          <h4 className="experiment-input-editor__section-title">Equipment</h4>
          <p className="experiment-input-editor__section-hint">Specify how long or how the instrument is used.</p>
          <div className="experiment-input-editor__rows">
            {equipmentRows.length ? equipmentRows.map((row) => this.renderEquipmentRow(row)) : (
              <p className="experiment-input-editor__state">No equipment rows yet.</p>
            )}
          </div>
        </section>
      </>
    );
  };

  render() {
    const { editing, saving, error, success } = this.state;

    return (
      <div className="experiment-input-editor">
        <div className="experiment-input-editor__head">
          <h3>Inputs</h3>
          <p className="experiment-input-editor__hint">
            Reagents use amount and unit; equipment uses duration or usage — both from the same catalog as inventory.
          </p>
        </div>

        {!editing ? (
          <>
            {this.renderViewTables()}
            <div className="experiment-input-editor__toolbar">
              <button type="button" className="experiment-input-editor__btn" onClick={this.startEditing}>
                Edit inputs
              </button>
              <button type="button" className="experiment-input-editor__btn experiment-input-editor__btn--ghost" onClick={() => this.addRow('reagent')}>
                Add reagent
              </button>
              <button type="button" className="experiment-input-editor__btn experiment-input-editor__btn--ghost" onClick={() => this.addRow('equipment')}>
                Add equipment
              </button>
            </div>
          </>
        ) : (
          <>
            {this.renderEditorRows()}
            <div className="experiment-input-editor__toolbar">
              <button
                type="button"
                className="experiment-input-editor__btn experiment-input-editor__btn--primary"
                onClick={this.handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save inputs'}
              </button>
              <button type="button" className="experiment-input-editor__btn" onClick={() => this.addRow('reagent')}>
                Add reagent
              </button>
              <button type="button" className="experiment-input-editor__btn" onClick={() => this.addRow('equipment')}>
                Add equipment
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
