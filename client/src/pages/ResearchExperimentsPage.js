import React, { Component } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ExperimentListPanel from '../components/ExperimentListPanel';
import { API_BASE } from '../config/api';

class ResearchExperimentsPage extends Component {
  state = {
    research: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchResearch();
  }

  fetchResearch = async () => {
    const { researchId } = this.props;

    try {
      const response = await axios.get(`${API_BASE}/researches/${researchId}`);
      this.setState({ research: response.data, loading: false });
    } catch (error) {
      console.error('Failed to load research:', error);
      this.setState({ loading: false, error: 'Failed to load research' });
    }
  };

  handleCreated = (experiment) => {
    this.props.navigate(
      `/projects/research/${this.props.researchId}/experiments/${experiment.id}`
    );
  };

  render() {
    const { researchId } = this.props;
    const { research, loading, error } = this.state;

    return (
      <div className="research-experiments-page inventory-page">
        <header className="inventory-page__hero">
          <div>
            <p className="inventory-page__eyebrow">
              <Link to="/projects/research-list">Projects</Link> › Experiments
            </p>
            <h1 className="inventory-page__title">
              {loading ? 'Loading…' : (research?.title || 'Research experiments')}
            </h1>
            <p className="inventory-page__subtitle">
              Experiment runs linked to this research project.
            </p>
          </div>
          <Link to="/projects/research-list" className="experiment-detail__back">
            Back to researches
          </Link>
        </header>

        {error && <p className="experiment-detail__state experiment-detail__state--error">{error}</p>}

        <section className="inventory-page__content">
          <ExperimentListPanel
            researchId={Number(researchId)}
            onCreated={this.handleCreated}
          />
        </section>
      </div>
    );
  }
}

function ResearchExperimentsPageRoute() {
  const { researchId } = useParams();
  const navigate = useNavigate();
  return <ResearchExperimentsPage researchId={researchId} navigate={navigate} />;
}

export default ResearchExperimentsPageRoute;
