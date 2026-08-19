import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import ExperimentInputEditor from '../components/ExperimentInputEditor';
import ExperimentOutputEditor from '../components/ExperimentOutputEditor';
import ExperimentMetadataEditor from '../components/ExperimentMetadataEditor';
import ExperimentRunPanel from '../components/ExperimentRunPanel';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * Миграция на http-инстанс:
 * endpoint эксперимента теперь собирается как API.experiments + /:id.
 * Проверка: Network -> GET /api/experiments/:id при открытии страницы.
 */

class ExperimentDetailPage extends Component {
  state = {
    experiment: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchExperiment();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.experimentId !== this.props.experimentId) {
      this.fetchExperiment();
    }
  }

  fetchExperiment = async () => {
    const { experimentId } = this.props;

    try {
      this.setState({ loading: true, error: null });
      const response = await http.get(`${API.experiments}/${experimentId}`);
      this.setState({ experiment: response.data, loading: false });
    } catch (error) {
      console.error('Failed to load experiment:', error);
      this.setState({
        loading: false,
        error: error.response?.data?.error || 'Failed to load experiment',
      });
    }
  };

  handleExperimentUpdated = (experiment) => {
    this.setState({ experiment });
  };

  render() {
    const { researchId } = this.props;
    const { experiment, loading, error } = this.state;

    return (
      <div className="experiment-detail inventory-page">
        <header className="inventory-page__hero experiment-detail__hero">
          <div>
            <p className="inventory-page__eyebrow">
              <Link to="/projects/research-list">Projects</Link>
              {' › '}
              <Link to={`/projects/research/${researchId}/experiments`}>Research experiments</Link>
            </p>
            <h1 className="inventory-page__title">
              {loading ? 'Loading experiment…' : (experiment?.name || 'Experiment')}
            </h1>
            {experiment && (
              <p className="inventory-page__subtitle">
                Status: {experiment.status}
                {experiment.research?.title ? ` · ${experiment.research.title}` : ''}
              </p>
            )}
          </div>
          <Link to={`/projects/research/${researchId}/experiments`} className="experiment-detail__back">
            Back to list
          </Link>
        </header>

        {loading && <p className="experiment-detail__state">Loading…</p>}
        {error && <p className="experiment-detail__state experiment-detail__state--error">{error}</p>}

        {!loading && !error && experiment && (
          <div className="experiment-detail__layout">
            <section className="inventory-page__content experiment-detail__panel">
              <ExperimentMetadataEditor
                experimentId={experiment.id}
                experiment={experiment}
                onSaved={this.handleExperimentUpdated}
              />
            </section>

            <section className="inventory-page__content experiment-detail__panel">
              <ExperimentRunPanel
                experimentId={experiment.id}
                experiment={experiment}
                onUpdated={this.handleExperimentUpdated}
              />
            </section>

            <section className="inventory-page__content experiment-detail__panel">
              <ExperimentInputEditor
                experimentId={experiment.id}
                inputs={experiment.inputs}
                onSaved={this.handleExperimentUpdated}
              />
            </section>

            <section className="inventory-page__content experiment-detail__panel">
              <ExperimentOutputEditor
                experimentId={experiment.id}
                outputs={experiment.outputs}
                onSaved={this.handleExperimentUpdated}
              />
            </section>
          </div>
        )}
      </div>
    );
  }
}

function ExperimentDetailPageRoute() {
  const { researchId, experimentId } = useParams();
  return <ExperimentDetailPage researchId={researchId} experimentId={experimentId} />;
}

export default ExperimentDetailPageRoute;
