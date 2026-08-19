import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * Миграция на единый http-клиент.
 * Проверка:
 * - GET /api/experiments?research_id=...
 * - POST /api/experiments (кнопка New experiment)
 */

const STATUS_CLASS = {
  Completed: 'success',
  Ongoing: 'info',
  Pending: 'warning',
};

class ExperimentListPanel extends Component {
  state = {
    experiments: [],
    loading: false,
    error: null,
    creating: false,
  };

  componentDidMount() {
    this.fetchExperiments();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.researchId !== this.props.researchId) {
      this.fetchExperiments();
    }
  }

  fetchExperiments = async () => {
    const { researchId } = this.props;
    if (!researchId) return;

    this.setState({ loading: true, error: null });

    try {
      const response = await http.get(API.experiments, {
        params: { research_id: researchId },
      });
      this.setState({ experiments: response.data, loading: false });
    } catch (error) {
      console.error('Failed to load experiments:', error);
      this.setState({ loading: false, error: 'Failed to load experiments' });
    }
  };

  handleCreateExperiment = async () => {
    const { researchId } = this.props;
    if (!researchId || this.state.creating) return;

    this.setState({ creating: true, error: null });

    try {
      const response = await http.post(API.experiments, {
        research_id: researchId,
        name: `Experiment ${new Date().toLocaleDateString()}`,
        status: 'Pending',
      });
      this.setState({ creating: false });
      if (this.props.onCreated) {
        this.props.onCreated(response.data);
      }
      this.fetchExperiments();
    } catch (error) {
      console.error('Failed to create experiment:', error);
      this.setState({
        creating: false,
        error: error.response?.data?.error || 'Failed to create experiment',
      });
    }
  };

  render() {
    const { researchId, compact } = this.props;
    const { experiments, loading, error, creating } = this.state;

    if (!researchId) return null;

    return (
      <div className={`experiment-list-panel${compact ? ' experiment-list-panel--compact' : ''}`}>
        <div className="experiment-list-panel__head">
          <h5 className="experiment-list-panel__title">
            Experiments
            <span className="experiment-list-panel__count">{experiments.length}</span>
          </h5>
          <div className="experiment-list-panel__actions">
            <button
              type="button"
              className="experiment-list-panel__btn"
              onClick={this.handleCreateExperiment}
              disabled={creating}
            >
              {creating ? 'Creating…' : 'New experiment'}
            </button>
            <Link
              to={`/projects/research/${researchId}/experiments`}
              className="experiment-list-panel__link"
            >
              View all
            </Link>
          </div>
        </div>

        {loading && <p className="experiment-list-panel__state">Loading experiments…</p>}
        {error && <p className="experiment-list-panel__state experiment-list-panel__state--error">{error}</p>}

        {!loading && !error && experiments.length === 0 && (
          <p className="experiment-list-panel__state">No experiments yet for this research.</p>
        )}

        {!loading && experiments.length > 0 && (
          <ul className="experiment-list-panel__list">
            {experiments.map((experiment) => (
              <li key={experiment.id} className="experiment-list-panel__item">
                <Link
                  to={`/projects/research/${researchId}/experiments/${experiment.id}`}
                  className="experiment-list-panel__item-link"
                  onClick={this.props.onNavigate}
                >
                  <strong>{experiment.name}</strong>
                  <span className={`experiment-list-panel__status experiment-list-panel__status--${STATUS_CLASS[experiment.status] || 'neutral'}`}>
                    {experiment.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default ExperimentListPanel;
