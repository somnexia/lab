import React from 'react';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: props.projects || [
        { id: 1, name: 'Project Alpha', description: 'First sample project' },
        { id: 2, name: 'Project Beta', description: 'Second sample project' },
      ],
    };
  }

  renderProject(project) {
    return (
      <li key={project.id} className="project-item">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </li>
    );
  }

  render() {
    const { projects } = this.state;

    return (
      <div className="projects-page">
        <header>
          <h1>Projects</h1>
        </header>

        {projects && projects.length ? (
          <ul className="projects-list">{projects.map(p => this.renderProject(p))}</ul>
        ) : (
          <p>No projects available.</p>
        )}
      </div>
    );
  }
}

export default Projects;
