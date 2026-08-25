import React, { Component } from 'react';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * Миграция на http-клиент:
 * обновление метаданных эксперимента выполняется через общий инстанс.
 * Проверка: PUT /api/experiments/:id при Save details.
 */

const STATUS_OPTIONS = ['Pending', 'Ongoing', 'Completed'];

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const fromDateInputValue = (value) => (value ? new Date(`${value}T12:00:00`).toISOString() : null);

class ExperimentMetadataEditor extends Component {
  state = {
    name: '',
    status: 'Pending',
    startDate: '',
    endDate: '',
    description: '',
    editing: false,
    saving: false,
    error: null,
    success: null,
  };

  componentDidMount() {
    this.syncFromProps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.experiment !== this.props.experiment) {
      this.syncFromProps();
    }
  }

  syncFromProps = () => {
    const { experiment } = this.props;
    if (!experiment) return;

    this.setState({
      name: experiment.name || '',
      status: experiment.status || 'Pending',
      startDate: toDateInputValue(experiment.start_date),
      endDate: toDateInputValue(experiment.end_date),
      description: experiment.description || '',
      editing: false,
      error: null,
      success: null,
    });
  };

  startEditing = () => {
    this.setState({ editing: true, error: null, success: null });
  };

  cancelEditing = () => {
    this.syncFromProps();
  };

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value, error: null });
  };

  handleSave = async () => {
    const { experimentId, onSaved } = this.props;
    const { name, status, startDate, endDate, description } = this.state;

    if (!name.trim()) {
      this.setState({ error: 'Name is required.' });
      return;
    }

    this.setState({ saving: true, error: null, success: null });

    try {
      const response = await http.put(`${API.experiments}/${experimentId}`, {
        name: name.trim(),
        status,
        start_date: fromDateInputValue(startDate),
        end_date: fromDateInputValue(endDate),
        description: description.trim() || null,
      });
      this.setState({ saving: false, editing: false, success: 'Experiment updated.' });
      if (onSaved) onSaved(response.data);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update experiment';
      this.setState({ saving: false, error: message });
    }
  };

  renderView = () => {
    const { experiment } = this.props;
    const { name, status, startDate, endDate, description } = this.state;

    return (
      <dl className="experiment-meta__list">
        <div className="experiment-meta__item">
          <dt>Name</dt>
          <dd>{name}</dd>
        </div>
        <div className="experiment-meta__item">
          <dt>Status</dt>
          <dd>
            <span className={`experiment-list-panel__status experiment-list-panel__status--${status === 'Completed' ? 'success' : status === 'Ongoing' ? 'info' : 'warning'}`}>
              {status}
            </span>
          </dd>
        </div>
        <div className="experiment-meta__item">
          <dt>Start date</dt>
          <dd>{startDate || '—'}</dd>
        </div>
        <div className="experiment-meta__item">
          <dt>End date</dt>
          <dd>{endDate || '—'}</dd>
        </div>
        <div className="experiment-meta__item experiment-meta__item--wide">
          <dt>Description</dt>
          <dd>{description || '—'}</dd>
        </div>
        {experiment?.research?.title && (
          <div className="experiment-meta__item">
            <dt>Research</dt>
            <dd>{experiment.research.title}</dd>
          </div>
        )}
      </dl>
    );
  };

  renderEditor = () => {
    const { name, status, startDate, endDate, description, saving } = this.state;

    return (
      <div className="experiment-meta__form">
        <label className="experiment-input-editor__field">
          <span className="experiment-input-editor__field-label">Name</span>
          <input type="text" value={name} onChange={this.handleChange('name')} />
        </label>

        <label className="experiment-input-editor__field">
          <span className="experiment-input-editor__field-label">Status</span>
          <select value={status} onChange={this.handleChange('status')}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="experiment-input-editor__field">
          <span className="experiment-input-editor__field-label">Start date</span>
          <input type="date" value={startDate} onChange={this.handleChange('startDate')} />
        </label>

        <label className="experiment-input-editor__field">
          <span className="experiment-input-editor__field-label">End date</span>
          <input type="date" value={endDate} onChange={this.handleChange('endDate')} />
        </label>

        <label className="experiment-input-editor__field experiment-meta__field-wide">
          <span className="experiment-input-editor__field-label">Description</span>
          <textarea rows={3} value={description} onChange={this.handleChange('description')} />
        </label>

        <div className="experiment-input-editor__toolbar experiment-meta__toolbar">
          <button
            type="button"
            className="experiment-input-editor__btn experiment-input-editor__btn--primary"
            onClick={this.handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save details'}
          </button>
          <button type="button" className="experiment-input-editor__btn experiment-input-editor__btn--ghost" onClick={this.cancelEditing}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { editing, error, success } = this.state;

    return (
      <section className="experiment-meta">
        <div className="experiment-input-editor__head">
          <h3>Experiment details</h3>
          <p className="experiment-input-editor__hint">
            Name, status, and schedule for this run.
          </p>
        </div>

        {!editing ? (
          <>
            {this.renderView()}
            <div className="experiment-input-editor__toolbar">
              <button type="button" className="experiment-input-editor__btn" onClick={this.startEditing}>
                Edit details
              </button>
            </div>
          </>
        ) : (
          this.renderEditor()
        )}

        {error && <p className="experiment-input-editor__message experiment-input-editor__message--error">{error}</p>}
        {success && <p className="experiment-input-editor__message experiment-input-editor__message--success">{success}</p>}
      </section>
    );
  }
}

export default ExperimentMetadataEditor;
