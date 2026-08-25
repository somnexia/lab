import React, { Component } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * InventoryLotForm — регистрация лота (пункт 5).
 * Было: axios + абсолютные API_INVENTORIES / API_REAGENTS / ...
 * Стало: http + API.inventories / API.reagents / API.storages / ...
 * Проверить: Register lot → POST /api/inventories
 */
const ITEM_TYPES = [
  { id: 'element', label: 'Element' },
  { id: 'compound', label: 'Compound' },
  { id: 'mixture', label: 'Mixture' },
  { id: 'equipment', label: 'Equipment' },
];

const STATUS_OPTIONS = ['available', 'reserved', 'in use', 'out of stock'];

const emptyForm = {
  item_type: '',
  reference_id: '',
  item_name: '',
  quantity_mode: 'substance',
  total_quantity: '',
  substance_amount: '',
  unit_measure: 'g',
  storage_id: '',
  storageunit_id: '',
  supplier: '',
  receipt_date: '',
  expiration_date: '',
  status: 'available',
  description: '',
  safety_info: '',
};

class InventoryLotForm extends Component {
  state = {
    form: { ...emptyForm, ...this.getInitialFormValues() },
    catalogOptions: [],
    storages: [],
    storageUnits: [],
    loadingCatalog: false,
    submitting: false,
    error: null,
    fieldErrors: {},
  };

  componentDidMount() {
    this.fetchStorages();
    if (this.state.form.item_type) {
      this.fetchCatalogOptions(this.state.form.item_type);
    }
    if (this.state.form.storage_id) {
      this.fetchStorageUnits(this.state.form.storage_id);
    }
  }

  getInitialFormValues() {
    const { initialValues = {} } = this.props;
    return {
      item_type: initialValues.item_type || '',
      reference_id: initialValues.reference_id ? String(initialValues.reference_id) : '',
      item_name: initialValues.item_name || '',
    };
  }

  fetchStorages = async () => {
    try {
      const response = await http.get(API.storages);
      this.setState({ storages: response.data });
    } catch (error) {
      console.error('Failed to load storages:', error);
    }
  };

  fetchStorageUnits = async (storageId) => {
    try {
      const response = await http.get(API.storageUnits);
      const storageUnits = response.data.filter(
        (unit) => String(unit.storage_id) === String(storageId)
      );
      this.setState({ storageUnits });
    } catch (error) {
      console.error('Failed to load storage units:', error);
      this.setState({ storageUnits: [] });
    }
  };

  fetchCatalogOptions = async (itemType) => {
    this.setState({ loadingCatalog: true });

    try {
      if (itemType === 'equipment') {
        const response = await http.get(API.chemEquipments);
        const catalogOptions = response.data.map((item) => ({
          kind: 'equipment',
          catalogId: item.id,
          name: item.name,
          label: `${item.name} (#${item.id})`,
        }));
        this.setState({ catalogOptions, loadingCatalog: false });
        return;
      }

      const response = await http.get(API.reagents, {
        params: { types: itemType },
      });
      const catalogOptions = response.data.map((item) => ({
        kind: item.kind,
        catalogId: item.catalogId,
        name: item.name,
        label: `${item.name} (${item.casId || item.kind})`,
      }));
      this.setState({ catalogOptions, loadingCatalog: false });
    } catch (error) {
      console.error('Failed to load catalog options:', error);
      this.setState({ catalogOptions: [], loadingCatalog: false });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prev) => ({
      form: { ...prev.form, [name]: value },
      fieldErrors: { ...prev.fieldErrors, [name]: null },
      error: null,
    }));

    if (name === 'item_type') {
      this.setState((prev) => ({
        form: {
          ...prev.form,
          item_type: value,
          reference_id: '',
          item_name: '',
        },
        catalogOptions: [],
      }));
      if (value) {
        this.fetchCatalogOptions(value);
      }
    }

    if (name === 'storage_id') {
      this.setState((prev) => ({
        form: { ...prev.form, storage_id: value, storageunit_id: '' },
        storageUnits: [],
      }));
      if (value) {
        this.fetchStorageUnits(value);
      }
    }

    if (name === 'reference_id') {
      const selected = this.state.catalogOptions.find(
        (item) => String(item.catalogId) === String(value)
      );
      if (selected) {
        this.setState((prev) => ({
          form: {
            ...prev.form,
            reference_id: value,
            item_name: selected.name,
          },
        }));
      }
    }
  };

  buildPayload = () => {
    const { form } = this.state;
    const payload = {
      item_type: form.item_type,
      reference_id: Number(form.reference_id),
      item_name: form.item_name || undefined,
      storage_id: Number(form.storage_id),
      supplier: form.supplier || null,
      receipt_date: form.receipt_date || null,
      expiration_date: form.expiration_date || null,
      status: form.status,
      description: form.description || null,
      safety_info: form.safety_info || null,
    };

    if (form.storageunit_id) {
      payload.storageunit_id = Number(form.storageunit_id);
    }

    if (form.quantity_mode === 'pieces') {
      payload.total_quantity = Number(form.total_quantity);
      payload.substance_amount = null;
      payload.unit_measure = form.unit_measure || null;
    } else {
      payload.substance_amount = Number(form.substance_amount);
      payload.total_quantity = null;
      payload.unit_measure = form.unit_measure || null;
    }

    return payload;
  };

  validateClient = () => {
    const { form } = this.state;
    const fieldErrors = {};

    if (!form.item_type) fieldErrors.item_type = 'Select material type';
    if (!form.reference_id) fieldErrors.reference_id = 'Select catalog item';
    if (!form.storage_id) fieldErrors.storage_id = 'Select warehouse';

    if (form.quantity_mode === 'pieces') {
      if (!form.total_quantity) fieldErrors.total_quantity = 'Enter quantity';
    } else if (!form.substance_amount) {
      fieldErrors.substance_amount = 'Enter amount';
    }

    this.setState({ fieldErrors });
    return Object.keys(fieldErrors).length === 0;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.validateClient()) return;

    this.setState({ submitting: true, error: null });

    try {
      const response = await http.post(API.inventories, this.buildPayload());
      this.setState({ submitting: false });
      if (this.props.onSuccess) {
        this.props.onSuccess(response.data);
      }
    } catch (error) {
      const apiError = error.response?.data?.error || 'Failed to register lot';
      this.setState({ submitting: false, error: apiError });
    }
  };

  renderFieldError = (name) => {
    const message = this.state.fieldErrors[name];
    if (!message) return null;
    return <span className="inventory-lot-form__error">{message}</span>;
  };

  render() {
    const { form, catalogOptions, storages, storageUnits, loadingCatalog, submitting, error } = this.state;

    return (
      <form className="inventory-lot-form" onSubmit={this.handleSubmit}>
        {error && (
          <div className="inventory-lot-form__alert" role="alert">
            {error}
          </div>
        )}

        <div className="inventory-lot-form__grid">
          <label className="inventory-lot-form__field">
            <span>Material type</span>
            <select name="item_type" value={form.item_type} onChange={this.handleChange} required>
              <option value="">Select type…</option>
              {ITEM_TYPES.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            {this.renderFieldError('item_type')}
          </label>

          <label className="inventory-lot-form__field">
            <span>Catalog item</span>
            <select
              name="reference_id"
              value={form.reference_id}
              onChange={this.handleChange}
              disabled={!form.item_type || loadingCatalog}
              required
            >
              <option value="">
                {loadingCatalog ? 'Loading…' : 'Select catalog entry…'}
              </option>
              {catalogOptions.map((item) => (
                <option key={item.catalogId} value={item.catalogId}>
                  {item.label}
                </option>
              ))}
            </select>
            {this.renderFieldError('reference_id')}
          </label>

          <label className="inventory-lot-form__field inventory-lot-form__field--wide">
            <span>Lot label (optional)</span>
            <input
              type="text"
              name="item_name"
              value={form.item_name}
              onChange={this.handleChange}
              placeholder="Auto-filled from catalog when empty"
            />
          </label>

          <fieldset className="inventory-lot-form__fieldset inventory-lot-form__field--wide">
            <legend>Quantity</legend>
            <div className="inventory-lot-form__quantity-row">
              <label>
                <input
                  type="radio"
                  name="quantity_mode"
                  value="substance"
                  checked={form.quantity_mode === 'substance'}
                  onChange={this.handleChange}
                />
                Amount
              </label>
              <label>
                <input
                  type="radio"
                  name="quantity_mode"
                  value="pieces"
                  checked={form.quantity_mode === 'pieces'}
                  onChange={this.handleChange}
                />
                Piece count
              </label>
            </div>
            {form.quantity_mode === 'pieces' ? (
              <input
                type="number"
                name="total_quantity"
                min="0"
                step="1"
                value={form.total_quantity}
                onChange={this.handleChange}
                placeholder="Count"
              />
            ) : (
              <input
                type="number"
                name="substance_amount"
                min="0"
                step="any"
                value={form.substance_amount}
                onChange={this.handleChange}
                placeholder="Amount"
              />
            )}
            <input
              type="text"
              name="unit_measure"
              value={form.unit_measure}
              onChange={this.handleChange}
              placeholder="Unit (g, mL, pcs…)"
            />
            {this.renderFieldError('total_quantity')}
            {this.renderFieldError('substance_amount')}
          </fieldset>

          <label className="inventory-lot-form__field">
            <span>Warehouse</span>
            <select name="storage_id" value={form.storage_id} onChange={this.handleChange} required>
              <option value="">Select warehouse…</option>
              {storages.map((storage) => (
                <option key={storage.id} value={storage.id}>
                  {storage.name || storage.storage_name || `Warehouse #${storage.id}`}
                </option>
              ))}
            </select>
            {this.renderFieldError('storage_id')}
          </label>

          <label className="inventory-lot-form__field">
            <span>Storage unit (optional)</span>
            <select
              name="storageunit_id"
              value={form.storageunit_id}
              onChange={this.handleChange}
              disabled={!form.storage_id}
            >
              <option value="">Not assigned yet</option>
              {storageUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name || unit.name || `Unit #${unit.id}`}
                </option>
              ))}
            </select>
          </label>

          <label className="inventory-lot-form__field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={this.handleChange}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="inventory-lot-form__field">
            <span>Supplier</span>
            <input type="text" name="supplier" value={form.supplier} onChange={this.handleChange} />
          </label>

          <label className="inventory-lot-form__field">
            <span>Receipt date</span>
            <input type="date" name="receipt_date" value={form.receipt_date} onChange={this.handleChange} />
          </label>

          <label className="inventory-lot-form__field">
            <span>Expiration date</span>
            <input type="date" name="expiration_date" value={form.expiration_date} onChange={this.handleChange} />
          </label>

          <label className="inventory-lot-form__field inventory-lot-form__field--wide">
            <span>Description</span>
            <textarea name="description" rows={2} value={form.description} onChange={this.handleChange} />
          </label>

          <label className="inventory-lot-form__field inventory-lot-form__field--wide">
            <span>Safety info</span>
            <textarea name="safety_info" rows={2} value={form.safety_info} onChange={this.handleChange} />
          </label>
        </div>

        <div className="inventory-lot-form__actions">
          <button
            type="submit"
            className="inventory-lot-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Register lot'}
          </button>
        </div>
      </form>
    );
  }
}

export default InventoryLotForm;
