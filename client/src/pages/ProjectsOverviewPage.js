import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * Миграция на единый HTTP-клиент:
 * - было: axios.get(`${API_BASE}/...`)
 * - стало: http.get(`${API....}`)
 * Проверка: Network -> GET /api/researches, /api/researches/ongoing/count, /api/tasks
 */

const PROJECT_LINKS = [
  {
    to: '/projects/research-list',
    title: 'Research list',
    description: 'Browse active and completed research projects.',
  },
  {
    to: '/projects/research-create',
    title: 'Create research',
    description: 'Start a new research project and assign metadata.',
  },
  {
    to: '/projects/task-list',
    title: 'Tasks',
    description: 'Track assignments and deadlines across projects.',
  },
  {
    to: '/projects/task-create',
    title: 'Create task',
    description: 'Add a task linked to an existing research project.',
  },
];

class ProjectsOverviewPage extends Component {
  state = {
    loading: true,
    error: null,
    researchTotal: 0,
    ongoingResearches: 0,
    taskTotal: 0,
  };

  componentDidMount() {
    this.fetchSummary();
  }

  fetchSummary = async () => {
    try {
      const [researchesRes, ongoingRes, tasksRes] = await Promise.all([
        http.get(API.researches),
        http.get(`${API.researches}/ongoing/count`),
        http.get(API.tasks),
      ]);

      this.setState({
        loading: false,
        researchTotal: Array.isArray(researchesRes.data) ? researchesRes.data.length : 0,
        ongoingResearches: ongoingRes.data?.count ?? 0,
        taskTotal: Array.isArray(tasksRes.data) ? tasksRes.data.length : 0,
      });
    } catch (error) {
      console.error('Failed to load projects overview:', error);
      this.setState({
        loading: false,
        error: 'Failed to load project summary',
      });
    }
  };

  renderStats = () => {
    const { loading, error, researchTotal, ongoingResearches, taskTotal } = this.state;

    if (loading) {
      return <p className="projects-overview__state">Loading summary…</p>;
    }

    if (error) {
      return <p className="projects-overview__state projects-overview__state--error">{error}</p>;
    }

    return (
      <div className="projects-overview__stats">
        <article className="projects-overview__stat">
          <strong>{researchTotal}</strong>
          <span>Research projects</span>
        </article>
        <article className="projects-overview__stat">
          <strong>{ongoingResearches}</strong>
          <span>Ongoing</span>
        </article>
        <article className="projects-overview__stat">
          <strong>{taskTotal}</strong>
          <span>Tasks</span>
        </article>
      </div>
    );
  };

  render() {
    return (
      <div className="projects-overview inventory-page">
        <header className="inventory-page__hero projects-overview__hero">
          <div>
            <p className="inventory-page__eyebrow">Projects</p>
            <h1 className="inventory-page__title">Projects overview</h1>
            <p className="inventory-page__subtitle">
              Research projects and tasks in one place. Open the full list or create a new project.
            </p>
          </div>
          <Link to="/projects/research-list" className="projects-overview__primary-link">
            Open research list
          </Link>
        </header>

        {this.renderStats()}

        <section className="inventory-page__content projects-overview__links">
          <h2 className="projects-overview__links-title">Quick navigation</h2>
          <div className="projects-overview__link-grid">
            {PROJECT_LINKS.map((item) => (
              <Link key={item.to} to={item.to} className="projects-overview__link-card">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

export default ProjectsOverviewPage;
