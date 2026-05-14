// client\src\components\TaskList.js
import React, { Component } from 'react';
import axios from 'axios';
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaEye,
    FaPlus,
    FaSearch,
    FaSpinner,
    FaTable,
    FaTasks,
    FaThLarge,
    FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import TaskDetailsModal from './TaskDetailsModal';

class TaskList extends Component {
    state = {
        tasks: [],
        statusCounts: {},
        selectedStatus: "All",
        loading: true,
        error: null,
        isModalOpen: false,
        selectedTask: null,
        searchQuery: "",
        sortConfig: {
            key: null,
            direction: "asc",
        },
        viewMode: "table",
    };

    componentDidMount() {
        this.fetchTasks();
    }

    fetchTasks = async () => {
        this.setState({ loading: true, error: null });

        try {
            const response = await axios.get('http://localhost:3000/api/tasks');
            const tasks = response.data;

            const statusCounts = tasks.reduce((acc, task) => {
                acc[task.status] = (acc[task.status] || 0) + 1;
                return acc;
            }, {});

            this.setState({ tasks, statusCounts, error: null });
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            this.setState({
                error: "Unable to load tasks. Please check the server connection and try again.",
            });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleStatusFilter = (status) => {
        this.setState({ selectedStatus: status });
    };

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    handleViewModeChange = (viewMode) => {
        this.setState({ viewMode });
    };

    openTaskDetails = (task) => {
        this.setState({ isModalOpen: true, selectedTask: task });
    };

    closeTaskDetails = () => {
        this.setState({
            isModalOpen: false,
            selectedTask: null,
        });
    };

    clearSearch = () => {
        this.setState({ searchQuery: "" });
    };

    resetFilters = () => {
        this.setState({
            selectedStatus: "All",
            searchQuery: "",
            sortConfig: {
                key: null,
                direction: "asc",
            },
        });
    };

    hasActiveFilters = () => {
        const { selectedStatus, searchQuery, sortConfig } = this.state;

        return selectedStatus !== "All" || searchQuery.trim() !== "" || Boolean(sortConfig.key);
    };

    handleSort = (key) => {
        this.setState((prevState) => {
            const isSameColumn = prevState.sortConfig.key === key;

            return {
                sortConfig: {
                    key,
                    direction: isSameColumn && prevState.sortConfig.direction === "asc" ? "desc" : "asc",
                },
            };
        });
    };

    getSortIndicator = (key) => {
        const { sortConfig } = this.state;

        if (sortConfig.key !== key) {
            return "";
        }

        return sortConfig.direction === "asc" ? " asc" : " desc";
    };

    getTaskSortValue = (task, key) => {
        switch (key) {
            case "title":
                return task.title || "";
            case "status":
                return task.status || "";
            case "user":
                return task.user?.name || "";
            case "start_date":
                return task.start_date ? new Date(task.start_date).getTime() : null;
            case "due_date":
                return task.due_date ? new Date(task.due_date).getTime() : null;
            default:
                return "";
        }
    };

    getDescriptionPreview = (description, maxLength = 90) => {
        if (!description) {
            return "No description";
        }

        return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
    };

    formatDate = (dateString) => dateString ? dateString.split('T')[0] : "-";

    getDateWithoutTime = (dateString) => {
        if (!dateString) {
            return null;
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        date.setHours(0, 0, 0, 0);
        return date;
    };

    isTaskClosed = (task) => {
        return ["Completed", "Canceled"].includes(task.status);
    };

    getDueDateInfo = (task) => {
        if (!task.due_date) {
            return {
                label: "No due date",
                tone: "muted",
                isOverdue: false,
            };
        }

        const dueDate = this.getDateWithoutTime(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isOverdue = !this.isTaskClosed(task) && dueDate && dueDate < today;

        return {
            label: this.formatDate(task.due_date),
            tone: isOverdue ? "danger" : "default",
            isOverdue,
        };
    };

    getTaskStats = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.state.tasks.reduce((stats, task) => {
            const dueDate = this.getDateWithoutTime(task.due_date);
            const isClosed = this.isTaskClosed(task);

            stats.total += 1;

            if (!isClosed) {
                stats.active += 1;
            }

            if (task.status === "Completed") {
                stats.completed += 1;
            }

            if (!isClosed && dueDate && dueDate < today) {
                stats.overdue += 1;
            }

            return stats;
        }, {
            total: 0,
            active: 0,
            completed: 0,
            overdue: 0,
        });
    };

    sortTasks = (tasks) => {
        const { sortConfig } = this.state;

        if (!sortConfig.key) {
            return tasks;
        }

        return [...tasks].sort((a, b) => {
            const firstValue = this.getTaskSortValue(a, sortConfig.key);
            const secondValue = this.getTaskSortValue(b, sortConfig.key);

            if (firstValue === null && secondValue === null) return 0;
            if (firstValue === null) return 1;
            if (secondValue === null) return -1;

            if (typeof firstValue === "number" && typeof secondValue === "number") {
                return sortConfig.direction === "asc"
                    ? firstValue - secondValue
                    : secondValue - firstValue;
            }

            const comparison = String(firstValue).localeCompare(String(secondValue), undefined, {
                sensitivity: "base",
            });

            return sortConfig.direction === "asc" ? comparison : -comparison;
        });
    };

    getFilteredTasks = () => {
        const { tasks, selectedStatus, searchQuery } = this.state;
        const normalizedQuery = searchQuery.trim().toLowerCase();

        const filteredByStatus = selectedStatus === "All"
            ? tasks
            : tasks.filter(task => task.status === selectedStatus);

        if (!normalizedQuery) {
            return this.sortTasks(filteredByStatus);
        }

        const filteredBySearch = filteredByStatus.filter((task) => {
            const searchableText = [
                task.title,
                task.description,
                task.user?.name,
                task.status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });

        return this.sortTasks(filteredBySearch);
    };

    getStatusTone = (status) => {
        switch (status) {
            case "Pending": return "secondary";
            case "Ongoing": return "warning";
            case "Completed": return "success";
            case "Draft": return "info";
            case "Canceled": return "dark";
            case "Critical": return "danger";
            default: return "neutral";
        }
    };

    renderStatusPill = (status) => (
        <span className={`task-status task-status--${this.getStatusTone(status)}`}>
            {status || "Unknown"}
        </span>
    );

    renderPrimaryAction = () => (
        <Link className="task-button task-button--primary" to="/projects/task-create">
            <FaPlus />
            <span>Add new task</span>
        </Link>
    );

    renderLoadingState = () => (
        <section className="task-empty task-empty--loading" aria-live="polite">
            <div className="task-spinner" aria-hidden="true"></div>
            <h3>Loading tasks...</h3>
            <p>Please wait while we fetch the latest task list.</p>
        </section>
    );

    renderErrorState = () => (
        <section className="task-empty task-empty--error" aria-live="assertive">
            <span className="task-empty__icon task-empty__icon--danger">
                <FaExclamationTriangle />
            </span>
            <h3>Unable to load tasks</h3>
            <p>{this.state.error}</p>
            <button type="button" className="task-button task-button--primary" onClick={this.fetchTasks}>
                Try again
            </button>
        </section>
    );

    renderEmptyState = () => (
        <section className="task-empty">
            <span className="task-empty__icon task-empty__icon--primary">
                <FaTasks />
            </span>
            <h3>No tasks yet</h3>
            <p>Create your first task to start tracking project work.</p>
            {this.renderPrimaryAction()}
        </section>
    );

    renderNoResultsState = () => {
        const { searchQuery, selectedStatus } = this.state;
        const hasSearch = searchQuery.trim() !== "";
        const hasStatusFilter = selectedStatus !== "All";

        return (
            <section className="task-empty">
                <span className="task-empty__icon">
                    <FaSearch />
                </span>
                <h3>No tasks found</h3>
                <p>
                    {hasSearch && <>No tasks match "{searchQuery.trim()}". </>}
                    {hasStatusFilter && <>Current status filter is "{selectedStatus}". </>}
                    Try another keyword or reset filters.
                </p>
                <div className="task-empty__actions">
                    {hasSearch && (
                        <button type="button" className="task-button task-button--ghost" onClick={this.clearSearch}>
                            Clear search
                        </button>
                    )}
                    {this.hasActiveFilters() && (
                        <button type="button" className="task-button task-button--primary" onClick={this.resetFilters}>
                            Reset filters
                        </button>
                    )}
                </div>
            </section>
        );
    };

    renderStats = (taskStats) => {
        const stats = [
            { label: "Total tasks", value: taskStats.total, icon: <FaTasks />, tone: "primary" },
            { label: "Active", value: taskStats.active, icon: <FaSpinner />, tone: "warning" },
            { label: "Completed", value: taskStats.completed, icon: <FaCheckCircle />, tone: "success" },
            { label: "Overdue", value: taskStats.overdue, icon: <FaExclamationTriangle />, tone: "danger" },
        ];

        return (
            <section className="task-stats" aria-label="Task statistics">
                {stats.map((item) => (
                    <article className="task-stat" key={item.label}>
                        <div>
                            <p>{item.label}</p>
                            <strong>{item.value}</strong>
                        </div>
                        <span className={`task-stat__icon task-stat__icon--${item.tone}`}>
                            {item.icon}
                        </span>
                    </article>
                ))}
            </section>
        );
    };

    renderFilters = (statusCounts, tasksCount, searchQuery) => (
        <section className="task-toolbar" aria-label="Task filters and search">
            <nav className="task-tabs" aria-label="Task status filters">
                <button
                    type="button"
                    className={`task-tab ${this.state.selectedStatus === "All" ? "task-tab--active" : ""}`}
                    onClick={() => this.handleStatusFilter("All")}
                >
                    All <span>{tasksCount}</span>
                </button>

                {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                        type="button"
                        key={status}
                        className={`task-tab ${this.state.selectedStatus === status ? "task-tab--active" : ""}`}
                        onClick={() => this.handleStatusFilter(status)}
                    >
                        {status} <span>{count}</span>
                    </button>
                ))}
            </nav>

            <div className="task-search">
                <FaSearch className="task-search__icon" />
                <input
                    type="search"
                    placeholder="Search by title, description, user or status"
                    aria-label="Search tasks"
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                />
                {searchQuery.trim() !== "" && (
                    <button type="button" onClick={this.clearSearch}>
                        Clear
                    </button>
                )}
            </div>
        </section>
    );

    renderViewToggle = () => {
        const { viewMode } = this.state;

        return (
            <div className="task-view-toggle" role="group" aria-label="Task view mode">
                <button
                    type="button"
                    className={viewMode === "table" ? "task-view-toggle__button task-view-toggle__button--active" : "task-view-toggle__button"}
                    onClick={() => this.handleViewModeChange("table")}
                >
                    <FaTable />
                    Table
                </button>
                <button
                    type="button"
                    className={viewMode === "cards" ? "task-view-toggle__button task-view-toggle__button--active" : "task-view-toggle__button"}
                    onClick={() => this.handleViewModeChange("cards")}
                >
                    <FaThLarge />
                    Cards
                </button>
            </div>
        );
    };

    renderTaskViewButton = (task) => (
        <button className="task-button task-button--ghost task-button--compact" onClick={() => this.openTaskDetails(task)}>
            <FaEye />
            <span>View</span>
        </button>
    );

    renderTaskTable = (tasks) => (
        <section className="task-table-shell" aria-label="Task table">
            <table className="task-table">
                <thead>
                    <tr>
                        <th>
                            <button type="button" onClick={() => this.handleSort("title")}>
                                Title{this.getSortIndicator("title")}
                            </button>
                        </th>
                        <th>Description</th>
                        <th>
                            <button type="button" onClick={() => this.handleSort("user")}>
                                Assigned User{this.getSortIndicator("user")}
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => this.handleSort("status")}>
                                Status{this.getSortIndicator("status")}
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => this.handleSort("start_date")}>
                                Start{this.getSortIndicator("start_date")}
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => this.handleSort("due_date")}>
                                Due{this.getSortIndicator("due_date")}
                            </button>
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => {
                        const dueDateInfo = this.getDueDateInfo(task);

                        return (
                            <tr key={task.id}>
                                <td>
                                    <strong>{task.title || "Untitled task"}</strong>
                                </td>
                                <td>
                                    <span className="task-table__description">
                                        {this.getDescriptionPreview(task.description, 70)}
                                    </span>
                                </td>
                                <td>
                                    <span className="task-meta-line">
                                        <FaUser />
                                        {task.user?.name || "Unknown"}
                                    </span>
                                </td>
                                <td>{this.renderStatusPill(task.status)}</td>
                                <td>{this.formatDate(task.start_date)}</td>
                                <td>
                                    <span className={`task-date task-date--${dueDateInfo.tone}`}>
                                        {dueDateInfo.label}
                                    </span>
                                    {dueDateInfo.isOverdue && <span className="task-status task-status--danger">Overdue</span>}
                                </td>
                                <td>{this.renderTaskViewButton(task)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );

    renderTaskCards = (tasks) => (
        <section className="task-card-grid" aria-label="Task cards">
            {tasks.map(task => {
                const dueDateInfo = this.getDueDateInfo(task);

                return (
                    <article className="task-card" key={task.id}>
                        <div className="task-card__header">
                            <h3>{task.title || "Untitled task"}</h3>
                            {this.renderStatusPill(task.status)}
                        </div>

                        <p className="task-card__description">
                            {this.getDescriptionPreview(task.description, 120)}
                        </p>

                        <div className="task-card__meta">
                            <span className="task-meta-line">
                                <FaUser />
                                {task.user?.name || "Unknown"}
                            </span>
                            <span className="task-meta-line">
                                <FaCalendarAlt />
                                <span className={`task-date task-date--${dueDateInfo.tone}`}>
                                    {dueDateInfo.label}
                                </span>
                                {dueDateInfo.isOverdue && <span className="task-status task-status--danger">Overdue</span>}
                            </span>
                        </div>

                        <div className="task-card__footer">
                            {this.renderTaskViewButton(task)}
                        </div>
                    </article>
                );
            })}
        </section>
    );

    render() {
        const { tasks, statusCounts, selectedTask, isModalOpen, loading, error, searchQuery, viewMode } = this.state;

        const taskStats = this.getTaskStats();
        const filteredTasks = this.getFilteredTasks();
        const hasNoTasks = !loading && !error && tasks.length === 0;
        const hasNoResults = !loading && !error && tasks.length > 0 && filteredTasks.length === 0;
        const shouldShowTaskContent = !loading && !error && tasks.length > 0;

        return (
            <>
                <main className="task-list">
                    <header className="task-list__header">
                        <div>
                            <p className="task-list__eyebrow">Project workspace</p>
                            <h1>Tasks <span>{tasks.length}</span></h1>
                        </div>
                        {this.renderPrimaryAction()}
                    </header>

                    {shouldShowTaskContent && this.renderStats(taskStats)}

                    {loading && this.renderLoadingState()}
                    {!loading && error && this.renderErrorState()}
                    {hasNoTasks && this.renderEmptyState()}

                    {shouldShowTaskContent && (
                        <>
                            {this.renderFilters(statusCounts, tasks.length, searchQuery)}

                            <section className="task-list__summary">
                                <p>Showing {filteredTasks.length} of {tasks.length} tasks</p>
                                <div>
                                    {this.renderViewToggle()}
                                    {this.hasActiveFilters() && (
                                        <button type="button" className="task-button task-button--ghost task-button--compact" onClick={this.resetFilters}>
                                            Reset filters
                                        </button>
                                    )}
                                </div>
                            </section>

                            {hasNoResults ? this.renderNoResultsState() : (
                                viewMode === "table"
                                    ? this.renderTaskTable(filteredTasks)
                                    : this.renderTaskCards(filteredTasks)
                            )}
                        </>
                    )}
                </main>

                <TaskDetailsModal
                    isOpen={isModalOpen}
                    task={selectedTask}
                    onClose={this.closeTaskDetails}
                />
            </>
        );
    }
}

export default TaskList;
