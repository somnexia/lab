import React, { Component } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import TaskDetailsModal from './TaskDetailsModal';

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
    render() {
        const { tasks, statusCounts, selectedTask, loading,
            modalLoading,
            error,
            isModalOpen, } = this.state;
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

                </div>
            </div>
        );
    }
}

export default TaskList;