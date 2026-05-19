import React, { Component } from "react";
import axios from "axios";
import ResearchTeamHubGrid from "../components/ResearchTeamHubGrid";
import ResearchTeamsMap from "../components/ResearchTeamsMap";
import ResearchDetailsModal from "../components/ResearchDetailsModal";

const API_BASE = "http://localhost:3000/api/research-teams";

const STATUS_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "Ongoing", label: "Ongoing" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
];

class ResearchTeamsPage extends Component {
    state = {
        viewMode: "hubs",
        statusFilter: "",
        loading: true,
        error: null,
        summary: [],
        graph: null,
        unassigned: [],
        isModalOpen: false,
        selectedResearch: null,
        modalLoading: false,
        modalError: null,
    };

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.statusFilter !== this.state.statusFilter) {
            this.loadData();
        }
    }

    buildQueryParams() {
        const { statusFilter } = this.state;
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        return params.toString();
    }

    loadData = async () => {
        this.setState({ loading: true, error: null });
        const qs = this.buildQueryParams();
        const suffix = qs ? `?${qs}` : "";

        try {
            const [summaryRes, graphRes, unassignedRes] = await Promise.all([
                axios.get(`${API_BASE}/summary${suffix}`),
                axios.get(`${API_BASE}/graph?groupBy=none${qs ? `&${qs}` : ""}`),
                axios.get(`${API_BASE}/unassigned`),
            ]);

            this.setState({
                summary: Array.isArray(summaryRes.data) ? summaryRes.data : [],
                graph: graphRes.data,
                unassigned: Array.isArray(unassignedRes.data) ? unassignedRes.data : [],
                loading: false,
            });
        } catch (err) {
            console.error("ResearchTeamsPage loadData:", err);
            this.setState({
                loading: false,
                error: "Could not load research teams. Check that the API server is running.",
            });
        }
    };

    setViewMode = (viewMode) => {
        this.setState({ viewMode });
    };

    handleStatusChange = (e) => {
        this.setState({ statusFilter: e.target.value });
    };

    openResearchModal = async (research) => {
        if (!research?.id) return;

        try {
            this.setState({
                selectedResearch: research,
                isModalOpen: true,
                modalLoading: true,
                modalError: null,
            });

            const researchResponse = await axios.get(
                `http://localhost:3000/api/researches/${research.id}`
            );

            this.setState({
                selectedResearch: { ...research, ...researchResponse.data },
                modalLoading: false,
            });
        } catch (err) {
            console.error("ResearchTeamsPage openResearchModal:", err);
            this.setState({
                modalError: "Could not load research details.",
                modalLoading: false,
            });
        }
    };

    openResearchFromMap = (entityId) => {
        const team = (this.state.summary || []).find((t) => t.id === entityId);
        if (team) this.openResearchModal(team);
    };

    closeResearchModal = () => {
        this.setState({
            isModalOpen: false,
            selectedResearch: null,
            modalLoading: false,
            modalError: null,
        });
    };

    countMembers() {
        return (this.state.summary || []).reduce(
            (sum, t) => sum + (t.participantCount || 0),
            0
        );
    }

    renderUnassigned() {
        const { unassigned } = this.state;
        if (!unassigned.length) return null;

        return (
            <aside className="research-teams__unassigned" aria-label="Unassigned members">
                <p className="research-teams__unassigned-title">
                    Members not linked to any research ({unassigned.length})
                </p>
                <ul className="research-teams__unassigned-list">
                    {unassigned.map((e) => {
                        const parts = [e.name, e.surname].filter(Boolean);
                        const label = parts.join(" ") || `Employee #${e.id}`;
                        return <li key={e.id}>{label}</li>;
                    })}
                </ul>
            </aside>
        );
    }

    renderContent() {
        const { loading, error, summary, graph, viewMode } = this.state;

        if (loading) {
            return <p className="research-teams__loading">Loading research teams…</p>;
        }
        if (error) {
            return <p className="research-teams__error" role="alert">{error}</p>;
        }
        if (!summary.length) {
            return (
                <p className="research-teams__empty">
                    No researches match the filter. Create a research and assign members in Projects.
                </p>
            );
        }

        if (viewMode === "map") {
            return (
                <ResearchTeamsMap
                    graph={graph}
                    onResearchClick={this.openResearchFromMap}
                />
            );
        }

        return (
            <ResearchTeamHubGrid
                teams={summary}
                onTeamClick={this.openResearchModal}
            />
        );
    }

    render() {
        const {
            viewMode,
            statusFilter,
            summary,
            loading,
            selectedResearch,
            isModalOpen,
            modalLoading,
            modalError,
        } = this.state;
        const teamCount = summary.length;
        const memberLinks = this.countMembers();

        return (
            <section className="research-teams" aria-labelledby="research-teams-heading">
                <header className="research-teams__header">
                    <p className="research-teams__eyebrow">Members &amp; Teams</p>
                    <h2 id="research-teams-heading" className="research-teams__title">
                        Research teams
                    </h2>
                    <p className="research-teams__subtitle">
                        Each research is a team: members are linked through research assignments.
                        Use hub cards for a quick overview or the map to see all connections.
                    </p>
                </header>

                <div className="research-teams__toolbar">
                    <div className="research-teams__filters">
                        <span className="research-teams__label">Status</span>
                        <select
                            className="research-teams__select"
                            value={statusFilter}
                            onChange={this.handleStatusChange}
                            aria-label="Filter by research status"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value || "all"} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="research-teams__view-tabs" role="tablist" aria-label="View mode">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === "hubs"}
                            className={
                                viewMode === "hubs"
                                    ? "research-teams__view-tab research-teams__view-tab--active"
                                    : "research-teams__view-tab"
                            }
                            onClick={() => this.setViewMode("hubs")}
                        >
                            Team hubs
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === "map"}
                            className={
                                viewMode === "map"
                                    ? "research-teams__view-tab research-teams__view-tab--active"
                                    : "research-teams__view-tab"
                            }
                            onClick={() => this.setViewMode("map")}
                        >
                            Connection map
                        </button>
                    </div>
                </div>

                {!loading && summary.length > 0 && (
                    <div className="research-teams__stats">
                        <span className="research-teams__stat">
                            <strong>{teamCount}</strong> researches (teams)
                        </span>
                        <span className="research-teams__stat">
                            <strong>{memberLinks}</strong> assignments
                        </span>
                    </div>
                )}

                {this.renderContent()}
                {!loading && this.renderUnassigned()}

                {selectedResearch && (
                    <ResearchDetailsModal
                        isOpen={isModalOpen}
                        research={selectedResearch}
                        onClose={this.closeResearchModal}
                        loading={modalLoading}
                        error={modalError}
                    />
                )}
            </section>
        );
    }
}

export default ResearchTeamsPage;
