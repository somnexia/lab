// client/src/components/TaskCreate.js
import React, { Component } from 'react';
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * TaskCreate — создание задачи (пункт 6).
 *
 * Было:
 *   axios.get('http://localhost:3000/api/researches')
 *   axios.get('http://localhost:3000/api/users')
 *   axios.post('http://localhost:3000/api/tasks', taskData)
 *
 * Стало:
 *   http.get(API.researches)
 *   http.get(API.users)
 *   http.post(API.tasks, taskData)
 *
 * Проверить (/projects/task-create):
 *   GET /api/researches, GET /api/users
 *   POST /api/tasks при сохранении
 */
class TaskCreate extends Component {
    state = {
        researches: [],
        selectedResearch: null,
        formData: {
            research_id: '',
            title: '',
            description: '',
            subtasks: '',
            user_id: '',
            reminder: '',
            start_date: '',
            due_date: '',
            status: 'Pending'
        },
        users: [],
        loading: false,
        error: null,
        success: false,
        validationErrors: {}
    };

    componentDidMount() {
        this.fetchResearches();
        this.fetchUsers();
    }

    fetchResearches = async () => {
        try {
            const response = await http.get(API.researches);
            this.setState({ researches: response.data });
        } catch (error) {
            console.error("Ошибка загрузки исследований:", error);
            this.setState({ error: "Не удалось загрузить список исследований" });
        }
    };

    fetchUsers = async () => {
        try {
            const response = await http.get(API.users);
            this.setState({ users: response.data });
        } catch (error) {
            console.error("Ошибка загрузки пользователей:", error);
        }
    };

    handleResearchSelect = (research) => {
        this.setState({
            selectedResearch: research,
            formData: {
                ...this.state.formData,
                research_id: research.id
            }
        });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value
            }
        });
        // Очищаем ошибку при изменении поля
        if (this.state.validationErrors[name]) {
            this.setState(prevState => ({
                validationErrors: {
                    ...prevState.validationErrors,
                    [name]: null
                }
            }));
        }
    };

    validateForm = () => {
        const errors = {};
        const { formData } = this.state;

        if (!formData.research_id) {
            errors.research_id = "Выберите исследование";
        }
        if (!formData.title || formData.title.trim().length === 0) {
            errors.title = "Заголовок обязателен";
        } else if (formData.title.length > 100) {
            errors.title = "Заголовок не должен превышать 100 символов";
        }
        if (!formData.start_date) {
            errors.start_date = "Дата начала обязательна";
        }
        if (
            formData.due_date &&
            formData.start_date &&
            new Date(formData.due_date) < new Date(formData.start_date)
        ) {
            errors.due_date = "Дата завершения должна быть позже даты начала";
        }

        this.setState({ validationErrors: errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const taskData = {
                ...this.state.formData,
                subtasks: this.state.formData.subtasks || null,
                reminder: this.state.formData.reminder || null,
                due_date: this.state.formData.due_date || null,
                user_id: this.state.formData.user_id || null
            };

            const response = await http.post(API.tasks, taskData);

            this.setState({
                success: true,
                loading: false,
                selectedResearch: null,
                formData: {
                    research_id: '',
                    title: '',
                    description: '',
                    subtasks: '',
                    user_id: '',
                    reminder: '',
                    start_date: '',
                    due_date: '',
                    status: 'Pending'
                }
            });

            // Перенаправление через 2 секунды
            setTimeout(() => {
                window.location.href = '/projects/task-list';
            }, 2000);
        } catch (error) {
            console.error("Ошибка создания задачи:", error);
            this.setState({
                error: error.response?.data?.message || "Не удалось создать задачу",
                loading: false
            });
        }
    };

    handleReset = () => {
        this.setState({
            selectedResearch: null,
            formData: {
                research_id: '',
                title: '',
                description: '',
                subtasks: '',
                user_id: '',
                reminder: '',
                start_date: '',
                due_date: '',
                status: 'Pending'
            },
            validationErrors: {},
            error: null,
            success: false
        });
    };

    getStatusBadgeColor = (status) => {
        switch (status) {
            case "Pending": return "secondary";
            case "Ongoing": return "warning";
            case "Completed": return "success";
            case "Draft": return "info";
            default: return "light";
        }
    };

    render() {
        const { researches, selectedResearch, formData, users, loading, error, success, validationErrors } = this.state;

        return (
            <div className="container-fluid py-4">
                {/* Заголовок */}
                <div className="d-flex align-items-center mb-4">
                    <Link to="/projects/tasks" className="btn btn-outline-secondary me-3">
                        <FaArrowLeft />
                    </Link>
                    <h2 className="mb-0">Create New Task</h2>
                </div>

                {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Успешно!</strong> Задача создана. Перенаправление...
                        <button type="button" className="btn-close" onClick={() => this.setState({ success: false })}></button>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => this.setState({ error: null })}></button>
                    </div>
                )}

                <div className="row">
                    {/* Список исследований (левая колонка) */}
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-body-primary text-white">
                                <h5 className="mb-0">Select Research</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="research-list" style={{
                                    maxHeight: '600px',
                                    overflowY: 'auto',
                                    border: '1px solid #dee2e6',
                                    borderTop: 'none'
                                }}>
                                    {researches.length === 0 ? (
                                        <div className="p-3 text-center text-muted">
                                            Нет доступных исследований
                                        </div>
                                    ) : (
                                        researches.map(research => (
                                            <div
                                                key={research.id}
                                                className={`p-3 border-bottom research-item ${selectedResearch?.id === research.id ? 'bg-primary bg-opacity-10 border-primary' : ''}`}
                                                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                onClick={() => this.handleResearchSelect(research)}
                                                onMouseEnter={(e) => {
                                                    if (selectedResearch?.id !== research.id) {
                                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (selectedResearch?.id !== research.id) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-1 text-truncate" title={research.title}>
                                                            {research.title}
                                                        </h6>
                                                        <small className="text-muted">
                                                            ID: {research.id}
                                                        </small>
                                                    </div>
                                                    {selectedResearch?.id === research.id && (
                                                        <span className="badge bg-primary">Selected</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {selectedResearch && (
                                <div className="card-footer bg-light">
                                    <small className="text-muted">
                                        Выбрано: <strong>{selectedResearch.title}</strong>
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Форма создания задачи (правая колонка) */}
                    <div className="col-lg-8">
                        <form onSubmit={this.handleSubmit}>
                            <div className="card shadow-sm">
                                <div className="card-header bg-body-primary text-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Task Details</h5>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-light"
                                        onClick={this.handleReset}
                                    >
                                        <FaTimes className="me-1" />
                                        Reset
                                    </button>
                                </div>
                                <div className="card-body">
                                    {/* Research ID (скрытое поле или отображение выбранного) */}
                                    {selectedResearch ? (
                                        <div className="alert alert-info mb-3">
                                            <strong>Research:</strong> {selectedResearch.title} (ID: {selectedResearch.id})
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning mb-3">
                                            <strong>Внимание:</strong> Выберите исследование из списка слева
                                        </div>
                                    )}

                                    <div className="row">
                                        {/* Title */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="title" className="form-label">
                                                Title <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={this.handleInputChange}
                                                placeholder="Enter task title (max 100 characters)"
                                                maxLength="100"
                                                required
                                            />
                                            {validationErrors.title && (
                                                <div className="invalid-feedback">{validationErrors.title}</div>
                                            )}
                                            <div className="form-text">
                                                {formData.title.length}/100 characters
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="description" className="form-label">
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={this.handleInputChange}
                                                rows="4"
                                                placeholder="Enter task description..."
                                            ></textarea>

                                        </div>

                                        {/* Subtasks */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="subtasks" className="form-label">
                                                Subtasks
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="subtasks"
                                                name="subtasks"
                                                value={formData.subtasks}
                                                onChange={this.handleInputChange}
                                                rows="3"
                                                placeholder="Enter subtasks (one per line)..."
                                            ></textarea>
                                            <div className="form-text">
                                                Список подзадач, разделенных новой строкой
                                            </div>
                                        </div>

                                        {/* User ID и Status */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="user_id" className="form-label">
                                                Assigned User
                                            </label>
                                            <select
                                                className="form-select"
                                                id="user_id"
                                                name="user_id"
                                                value={formData.user_id}
                                                onChange={this.handleInputChange}
                                            >
                                                <option value="">Select user...</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name || user.email || `User ${user.id}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="status" className="form-label">
                                                Status
                                            </label>
                                            <select
                                                className="form-select"
                                                id="status"
                                                name="status"
                                                value={formData.status}
                                                onChange={this.handleInputChange}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Draft">Draft</option>
                                                <option value="Ongoing">Ongoing</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <span className={`badge bg-${this.getStatusBadgeColor(formData.status)} mt-2`}>
                                                {formData.status}
                                            </span>
                                        </div>

                                        {/* Start Date и Due Date */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="start_date" className="form-label">
                                                Start Date <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className={`form-control ${validationErrors.start_date ? 'is-invalid' : ''}`}
                                                id="start_date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={this.handleInputChange}
                                                required
                                            />
                                            {validationErrors.start_date && (
                                                <div className="invalid-feedback">{validationErrors.start_date}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="due_date" className="form-label">
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                className={`form-control ${validationErrors.due_date ? 'is-invalid' : ''}`}
                                                id="due_date"
                                                name="due_date"
                                                value={formData.due_date}
                                                onChange={this.handleInputChange}
                                            />
                                            {validationErrors.due_date && (
                                                <div className="invalid-feedback">{validationErrors.due_date}</div>
                                            )}
                                        </div>

                                        {/* Reminder */}
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="reminder" className="form-label">
                                                Reminder Time
                                            </label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="reminder"
                                                name="reminder"
                                                value={formData.reminder}
                                                onChange={this.handleInputChange}
                                            />
                                            <div className="form-text">
                                                Время напоминания (опционально)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-end gap-2">
                                    <Link to="/projects/tasks" className="btn btn-secondary">
                                        <FaArrowLeft className="me-2" />
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || !selectedResearch}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="me-2" />
                                                Create Task
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default TaskCreate;