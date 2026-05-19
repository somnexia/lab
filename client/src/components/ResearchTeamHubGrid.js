import React, { Component } from "react";

function initialsFromName(name) {
    if (!name || typeof name !== "string") return "?";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function statusClass(status) {
    const s = (status || "").toString().toLowerCase();
    if (s === "ongoing") return "research-teams__status research-teams__status--ongoing";
    if (s === "completed") return "research-teams__status research-teams__status--completed";
    return "research-teams__status research-teams__status--pending";
}

class ResearchTeamHubGrid extends Component {
    handleHubKeyDown = (event, team) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const { onTeamClick } = this.props;
            if (onTeamClick) onTeamClick(team);
        }
    };

    renderMember(participant) {
        const emp = participant.employee;
        if (!emp) return null;
        const role = participant.role ? participant.role : "Member";

        return (
            <li key={participant.membershipId || `${emp.id}-${role}`} className="research-teams__member">
                <span className="research-teams__avatar" aria-hidden>
                    {initialsFromName(emp.name)}
                </span>
                <span className="research-teams__member-info">
                    <span className="research-teams__member-name" title={emp.name}>
                        {emp.name}
                    </span>
                    <span className="research-teams__member-role">
                        {role}
                        {emp.department ? ` · ${emp.department}` : ""}
                    </span>
                </span>
            </li>
        );
    }

    renderHub(team) {
        const { onTeamClick } = this.props;
        const participants = team.participants || [];
        const clickable = typeof onTeamClick === "function";

        const head = (
            <header className="research-teams__hub-head">
                <h3 id={`research-team-${team.id}`} className="research-teams__hub-title">
                    {team.title}
                </h3>
                <div className="research-teams__hub-meta">
                    <span className={statusClass(team.status)}>{team.status || "—"}</span>
                    {team.type ? <span>{team.type}</span> : null}
                    <span>
                        {participants.length} member{participants.length === 1 ? "" : "s"}
                    </span>
                </div>
                {clickable ? (
                    <span className="research-teams__hub-open-hint">View research details</span>
                ) : null}
            </header>
        );

        const body = (
            <div className="research-teams__hub-body">
                {participants.length === 0 ? (
                    <p className="research-teams__hub-empty">No members assigned yet.</p>
                ) : (
                    <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                        {participants.map((p) => this.renderMember(p))}
                    </ul>
                )}
            </div>
        );

        if (clickable) {
            return (
                <button
                    key={team.id}
                    type="button"
                    className="research-teams__hub research-teams__hub--clickable"
                    aria-labelledby={`research-team-${team.id}`}
                    onClick={() => onTeamClick(team)}
                    onKeyDown={(e) => this.handleHubKeyDown(e, team)}
                >
                    {head}
                    {body}
                </button>
            );
        }

        return (
            <article key={team.id} className="research-teams__hub" aria-labelledby={`research-team-${team.id}`}>
                {head}
                {body}
            </article>
        );
    }

    render() {
        const { teams } = this.props;
        if (!teams || teams.length === 0) {
            return null;
        }

        return (
            <div className="research-teams__hub-grid">
                {teams.map((team) => this.renderHub(team))}
            </div>
        );
    }
}

export default ResearchTeamHubGrid;
