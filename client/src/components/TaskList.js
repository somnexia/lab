import React, { Component } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import TaskDetailsModal from './TaskDetailsOffcanvas';

class TaskList extends Component {
    state = {
        tasks: [],  // Храним список исследований
        statusCounts: {},  // Храним количество исследований по статусам
        selectedStatus: "All",
        modalLoading: false,
        error: null,
        isModalOpen: false,
        selectedTask: null,

    };
    

    componentDidMount() {
        this.fetchTasks();
    }

    fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/tasks');
            const tasks = response.data;

            // Подсчитываем количество исследований в каждом статусе
            const statusCounts = tasks.reduce((acc, task) => {
                acc[task.status] = (acc[task.status] || 0) + 1;
                return acc;
            }, {});

            this.setState({ tasks, statusCounts });
            console.log("tasks", tasks)
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };
    handleStatusFilter = (status) => {
        this.setState({ selectedStatus: status });
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
        const { tasks, statusCounts, selectedTask, loading,
            modalLoading,
            error,
            isModalOpen} = this.state;
        const formatDate = (dateString) => dateString.split('T')[0];

        const filteredTasks = this.state.selectedStatus === "All"
            ? this.state.tasks
            : this.state.tasks.filter(task => task.status === this.state.selectedStatus);
        return (
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

                {/* Фильтры и поиск */}
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
                        <div className='d-flex align-items-center gap-1'>
                            <div className='search-box me-3'>
                                <form className="d-flex align-items-center position-relative" role="search">
                                    <input className="form-control me-2 search-input" type="search" placeholder="Search tasks" aria-label="Search tasks"></input>
                                    <FaSearch className='search-box-icon' />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Список исследований */}
                <div className='mb-5'>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Assigned User</th>
                                    <th>Status</th>
                                    <th>Start</th>
                                    <th>Due</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center">No tasks found</td>
                                    </tr>
                                )}
                                {filteredTasks.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.title}</td>
                                        <td>{task.description?.slice(0, 60)}...</td>
                                        <td>{task.user?.name || "Unknown"}</td>
                                        <td><span className={`badge bg-${this.getBadgeColor(task.status)}`}>{task.status}</span></td>
                                        <td>{formatDate(task.start_date)}</td>
                                        <td>{task.due_date ? formatDate(task.due_date) : "-"}</td>
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
            </div>
        );
    }
}

export default TaskList;