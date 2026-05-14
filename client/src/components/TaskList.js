// client\src\components\TaskList.js
import React, { Component } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaTasks, FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import TaskDetailsModal from './TaskDetailsOffcanvas';

class TaskList extends Component {
    state = {
        tasks: [],  // Храним список исследований
        statusCounts: {},  // Храним количество исследований по статусам
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

    };


    componentDidMount() {
        this.fetchTasks();
    }

    fetchTasks = async () => {
        this.setState({ loading: true, error: null });

        try {
            const response = await axios.get('http://localhost:3000/api/tasks');
            const tasks = response.data;

            // Подсчитываем количество исследований в каждом статусе
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

        return sortConfig.direction === "asc" ? " (asc)" : " (desc)";
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

    getDescriptionPreview = (description) => {
        if (!description) {
            return "-";
        }

        return description.length > 60 ? `${description.slice(0, 60)}...` : description;
    };

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

    renderLoadingState = () => (
        <div className="card border-0 shadow-sm mb-5">
            <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status" aria-label="Loading tasks"></div>
                <h5 className="mt-3 mb-1">Loading tasks...</h5>
                <p className="text-body-tertiary mb-0">Please wait while we fetch the latest task list.</p>
            </div>
        </div>
    );

    renderErrorState = () => (
        <div className="card border-0 shadow-sm mb-5">
            <div className="card-body text-center py-5">
                <div className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "52px", height: "52px" }}>
                    <FaExclamationTriangle />
                </div>
                <h5 className="mb-2">Unable to load tasks</h5>
                <p className="text-body-tertiary mb-4">{this.state.error}</p>
                <button type="button" className="btn btn-primary" onClick={this.fetchTasks}>
                    Try again
                </button>
            </div>
        </div>
    );

    renderEmptyState = () => (
        <div className="card border-0 shadow-sm mb-5">
            <div className="card-body text-center py-5">
                <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "52px", height: "52px" }}>
                    <FaTasks />
                </div>
                <h5 className="mb-2">No tasks yet</h5>
                <p className="text-body-tertiary mb-4">Create your first task to start tracking project work.</p>
                <Link className="btn btn-primary" to="/projects/task-create">
                    <span className='nav-link-icon'><FaPlus /></span>
                    <span>Add new task</span>
                </Link>
            </div>
        </div>
    );

    renderNoResultsState = () => {
        const { searchQuery, selectedStatus } = this.state;
        const hasSearch = searchQuery.trim() !== "";
        const hasStatusFilter = selectedStatus !== "All";

        return (
            <div className="card border-0 shadow-sm mb-5">
                <div className="card-body text-center py-5">
                    <div className="bg-secondary-subtle text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "52px", height: "52px" }}>
                        <FaSearch />
                    </div>
                    <h5 className="mb-2">No tasks found</h5>
                    <p className="text-body-tertiary mb-4">
                        {hasSearch && <>No tasks match "{searchQuery.trim()}". </>}
                        {hasStatusFilter && <>Current status filter is "{selectedStatus}". </>}
                        Try another keyword or reset filters.
                    </p>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {hasSearch && (
                            <button type="button" className="btn btn-outline-secondary" onClick={this.clearSearch}>
                                Clear search
                            </button>
                        )}
                        {this.hasActiveFilters() && (
                            <button type="button" className="btn btn-primary" onClick={this.resetFilters}>
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    getBadgeColor = (status) => {
        switch (status) {
            case "Pending": return "secondary";
            case "Ongoing": return "warning";
            case "Completed": return "success";
            case "Draft": return "info";
            case "Canceled": return "dark";
            case "Critical": return "danger";
            default: return "light";
        }
    }

    render() {
        const { tasks, statusCounts, selectedTask, isModalOpen, loading, error, searchQuery } = this.state;
        const formatDate = (dateString) => dateString ? dateString.split('T')[0] : "-";

        const taskStats = this.getTaskStats();
        const filteredTasks = this.getFilteredTasks();
        const hasNoTasks = !loading && !error && tasks.length === 0;
        const hasNoResults = !loading && !error && tasks.length > 0 && filteredTasks.length === 0;
        const shouldShowTaskContent = !loading && !error && tasks.length > 0;

        return (
            <>
                <div>
                    <div className="d-flex flex-wrap mb-4 gap-3 gap-sm-5 align-items-center">
                        <h2 className="mb-0">
                            <span className="me-3">Tasks</span>
                            <span className="fw-normal text-body-tertiary">({tasks.length})</span>
                        </h2>
                        <Link className="btn btn-primary px-5 d-flex align-items-center" to="/projects/task-create">
                            <span className='nav-link-icon'><FaPlus /></span>
                            <span>Add new task</span>
                        </Link>
                    </div>
                    <hr />

                    {shouldShowTaskContent && (
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-body-tertiary mb-1">Total tasks</p>
                                            <h3 className="mb-0">{taskStats.total}</h3>
                                        </div>
                                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                                            <FaTasks />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-body-tertiary mb-1">Active</p>
                                            <h3 className="mb-0">{taskStats.active}</h3>
                                        </div>
                                        <div className="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                                            <FaSpinner />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-body-tertiary mb-1">Completed</p>
                                            <h3 className="mb-0">{taskStats.completed}</h3>
                                        </div>
                                        <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                                            <FaCheckCircle />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-body-tertiary mb-1">Overdue</p>
                                            <h3 className="mb-0">{taskStats.overdue}</h3>
                                        </div>
                                        <div className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px" }}>
                                            <FaExclamationTriangle />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && this.renderLoadingState()}
                    {!loading && error && this.renderErrorState()}
                    {hasNoTasks && this.renderEmptyState()}

                    {shouldShowTaskContent && (
                        <>
                            <div className='g-3 justify-content-between align-items-center mb-4 row'>
                                <div className='col-sm-auto col-12'>
                                    <div className="nav nav-links mx-2 nav">
                                        <div className="nav-item">
                                            <a role="button" className={`px-2 py-1 nav-link ${this.state.selectedStatus === "All" ? "active" : ""}`}
                                                onClick={() => this.handleStatusFilter("All")}>
                                                All <span className="text-body-tertiary fw-semibold">({this.state.tasks.length})</span>
                                            </a>
                                        </div>
                                        {Object.entries(statusCounts).map(([status, count]) => (
                                            <div key={status} className="nav-item">
                                                <a
                                                    role="button"
                                                    className={`px-2 py-1 nav-link ${this.state.selectedStatus === status ? "active" : ""}`}
                                                    onClick={() => this.handleStatusFilter(status)}
                                                >
                                                    {status} <span className="text-body-tertiary fw-semibold">({count})</span>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='col-sm-auto col-12'>
                                    <div className='d-flex align-items-center gap-2'>
                                        <div className='search-box me-2'>
                                            <form className="d-flex align-items-center position-relative" role="search" onSubmit={(event) => event.preventDefault()}>
                                                <input
                                                    className="form-control me-2 search-input"
                                                    type="search"
                                                    placeholder="Search by title, description, user or status"
                                                    aria-label="Search tasks"
                                                    value={searchQuery}
                                                    onChange={this.handleSearchChange}
                                                />
                                                <FaSearch className='search-box-icon' />
                                            </form>
                                        </div>
                                        {searchQuery.trim() !== "" && (
                                            <button type="button" className="btn btn-outline-secondary" onClick={this.clearSearch}>
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                <span className="text-body-tertiary">
                                    Showing {filteredTasks.length} of {tasks.length} tasks
                                </span>
                                {this.hasActiveFilters() && (
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={this.resetFilters}>
                                        Reset filters
                                    </button>
                                )}
                            </div>

                            {hasNoResults ? this.renderNoResultsState() : (
                                <div className='mb-5'>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-body text-decoration-none fw-semibold"
                                                            onClick={() => this.handleSort("title")}
                                                        >
                                                            Title{this.getSortIndicator("title")}
                                                        </button>
                                                    </th>
                                                    <th>Description</th>
                                                    <th>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-body text-decoration-none fw-semibold"
                                                            onClick={() => this.handleSort("user")}
                                                        >
                                                            Assigned User{this.getSortIndicator("user")}
                                                        </button>
                                                    </th>
                                                    <th>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-body text-decoration-none fw-semibold"
                                                            onClick={() => this.handleSort("status")}
                                                        >
                                                            Status{this.getSortIndicator("status")}
                                                        </button>
                                                    </th>
                                                    <th>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-body text-decoration-none fw-semibold"
                                                            onClick={() => this.handleSort("start_date")}
                                                        >
                                                            Start{this.getSortIndicator("start_date")}
                                                        </button>
                                                    </th>
                                                    <th>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link p-0 text-body text-decoration-none fw-semibold"
                                                            onClick={() => this.handleSort("due_date")}
                                                        >
                                                            Due{this.getSortIndicator("due_date")}
                                                        </button>
                                                    </th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTasks.map(task => (
                                                    <tr key={task.id}>
                                                        <td>{task.title}</td>
                                                        <td>{this.getDescriptionPreview(task.description)}</td>
                                                        <td>{task.user?.name || "Unknown"}</td>
                                                        <td><span className={`badge bg-${this.getBadgeColor(task.status)}`}>{task.status}</span></td>
                                                        <td>{formatDate(task.start_date)}</td>
                                                        <td>{formatDate(task.due_date)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => this.setState({ isModalOpen: true, selectedTask: task })}>
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <TaskDetailsModal
                    isOpen={isModalOpen}
                    task={selectedTask}
                    onClose={() =>
                        this.setState({
                            isModalOpen: false,
                            selectedTask: null
                        })
                    }
                />
            </>
        );
    }
}

export default TaskList;