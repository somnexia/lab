import React, { Component } from 'react';
import axios from 'axios';
import { API_EXPERIMENTS } from '../config/api';

const STATUS_CLASS = {
  ok: 'success',
  insufficient: 'danger',
  warning: 'warning',
  skipped: 'neutral',
};

class ExperimentRunPanel extends Component {
  state = {
    stockCheck: null,
    loadingCheck: false,
    running: false,
    completing: false,
    error: null,
    success: null,
  };

  componentDidMount() {
    this.fetchStockCheck();
  }

  componentDidUpdate(prevProps) {
    const experimentChanged =
      prevProps.experimentId !== this.props.experimentId
      || prevProps.experiment?.inputs !== this.props.experiment?.inputs
      || prevProps.experiment?.status !== this.props.experiment?.status
      || prevProps.experiment?.consumptions !== this.props.experiment?.consumptions;

    if (experimentChanged) {
      this.setState({ success: null, error: null });
      this.fetchStockCheck();
    }
  }

  fetchStockCheck = async () => {
    const { experimentId } = this.props;
    if (!experimentId) return;

    this.setState({ loadingCheck: true, error: null });

    try {
      const response = await axios.get(`${API_EXPERIMENTS}/${experimentId}/stock-check`);
      this.setState({ stockCheck: response.data, loadingCheck: false });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to check stock';
      this.setState({ loadingCheck: false, error: message });
    }
  };

  handleRun = async () => {
    const { experimentId, onUpdated } = this.props;

    this.setState({ running: true, error: null, success: null });

    try {
      const response = await axios.post(`${API_EXPERIMENTS}/${experimentId}/run`);
      this.setState({
        running: false,
        stockCheck: response.data.stockCheck,
        success: 'Experiment started — stock deducted from warehouse.',
      });
      if (onUpdated) onUpdated(response.data.experiment);
    } catch (error) {
      const stockCheck = error.response?.data?.details?.stockCheck;
      const message = error.response?.data?.error || 'Failed to run experiment';
      this.setState({
        running: false,
        error: message,
        stockCheck: stockCheck || this.state.stockCheck,
      });
    }
  };

  handleComplete = async () => {
    const { experimentId, onUpdated } = this.props;

    this.setState({ completing: true, error: null, success: null });

    try {
      const response = await axios.post(`${API_EXPERIMENTS}/${experimentId}/complete`);
      this.setState({ completing: false, success: 'Experiment completed.' });
      if (onUpdated) onUpdated(response.data);
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to complete experiment';
      this.setState({ completing: false, error: message });
    }
  };

  renderChecks = () => {
    const { stockCheck, loadingCheck } = this.state;

    if (loadingCheck) {
      return <p className="experiment-run__state">Checking stock…</p>;
    }

    if (!stockCheck) return null;

    return (
      <>
        <p className={`experiment-run__summary experiment-run__summary--${stockCheck.ready ? 'ok' : 'bad'}`}>
          {stockCheck.summary}
        </p>

        {stockCheck.checks?.length > 0 && (
          <ul className="experiment-run__checks">
            {stockCheck.checks.map((check, index) => (
              <li
                key={`${check.inputId ?? 'new'}-${check.catalogName}-${index}`}
                className={`experiment-run__check experiment-run__check--${STATUS_CLASS[check.status] || 'neutral'}`}
              >
                <strong>{check.catalogName || `Input #${check.inputId}`}</strong>
                <span>{check.reason}</span>
                {check.requested != null && (
                  <span className="experiment-run__check-meta">
                    Requested: {check.requested}{check.unitMeasure ? ` ${check.unitMeasure}` : ''}
                    {' · '}
                    Available: {check.available} ({check.source})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  renderConsumptions = () => {
    const consumptions = this.props.experiment?.consumptions || [];

    if (!consumptions.length) {
      return null;
    }

    return (
      <section className="experiment-run__actuals">
        <h4 className="experiment-input-editor__section-title">Actual consumptions</h4>
        <p className="experiment-input-editor__section-hint">
          Stock deducted from warehouse lots when the experiment was run or completed.
        </p>
        <table className="experiment-input-editor__table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Lot</th>
              <th>Consumed</th>
              <th>Phase</th>
            </tr>
          </thead>
          <tbody>
            {consumptions.map((row) => (
              <tr key={row.id}>
                <td>{row.catalogName || `${row.itemType} #${row.referenceId}`}</td>
                <td>{row.inventoryLotLabel || `Lot #${row.inventoryId}`}</td>
                <td>
                  {row.quantityConsumed}
                  {row.unitMeasure ? ` ${row.unitMeasure}` : ''}
                </td>
                <td>{row.consumptionPhase || row.consumption_phase || 'run'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  render() {
    const { experiment } = this.props;
    const { running, completing, error, success } = this.state;
    const status = experiment?.status || 'Pending';
    const canRun = status === 'Pending';
    const canComplete = status === 'Ongoing';

    return (
      <section className="experiment-run">
        <div className="experiment-input-editor__head">
          <h3>Run</h3>
          <p className="experiment-input-editor__hint">
            Run deducts reagent stock from selected lots (FIFO if no lot pinned). Complete finalizes the run.
          </p>
        </div>

        {this.renderChecks()}
        {this.renderConsumptions()}

        <div className="experiment-input-editor__toolbar">
          {canRun && (
            <button
              type="button"
              className="experiment-input-editor__btn experiment-input-editor__btn--primary"
              onClick={this.handleRun}
              disabled={running}
            >
              {running ? 'Starting…' : 'Run experiment'}
            </button>
          )}
          {canComplete && (
            <button
              type="button"
              className="experiment-input-editor__btn experiment-input-editor__btn--primary"
              onClick={this.handleComplete}
              disabled={completing}
            >
              {completing ? 'Completing…' : 'Mark completed'}
            </button>
          )}
          <button
            type="button"
            className="experiment-input-editor__btn experiment-input-editor__btn--ghost"
            onClick={this.fetchStockCheck}
          >
            Refresh stock check
          </button>
        </div>

        {status === 'Completed' && !experiment?.consumptions?.length && (
          <p className="experiment-run__state">This experiment is completed. No reagent consumptions were recorded.</p>
        )}

        {status === 'Completed' && experiment?.consumptions?.length > 0 && (
          <p className="experiment-run__state">Completed — see actual consumptions above.</p>
        )}

        {error && <p className="experiment-input-editor__message experiment-input-editor__message--error">{error}</p>}
        {success && <p className="experiment-input-editor__message experiment-input-editor__message--success">{success}</p>}
      </section>
    );
  }
}

export default ExperimentRunPanel;
