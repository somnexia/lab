import React, { Component } from 'react';
import {
    FaAlignLeft,
    FaBan,
    FaCalendarAlt,
    FaCheckCircle,
    FaEdit,
    FaExclamationTriangle,
    FaRegClock,
    FaTimes,
    FaTrashAlt,
    FaUser,
} from "react-icons/fa";

class TaskDetailsModal extends Component {
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        const { isOpen, onClose } = this.props;

        if (isOpen && event.key === "Escape") {
            onClose();
        }
    };

    handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            this.props.onClose();
        }
    };

    formatDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        return dateString.split("T")[0];
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

    isTaskOverdue = (task) => {
        const dueDate = this.getDateWithoutTime(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return !this.isTaskClosed(task) && dueDate && dueDate < today;
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
    };

    renderActionButton = ({ label, icon, className, onClick, disabled }) => (
        <button
            type="button"
            className={className}
            onClick={onClick}
            disabled={disabled}
            title={disabled ? "Connect this action handler when the API is ready" : undefined}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    render() {
        const {
            isOpen,
            task,
            onClose,
            onEdit,
            onMarkComplete,
            onCancelTask,
            onDeleteTask,
        } = this.props;

        if (!isOpen || !task) {
            return null;
        }

        const isOverdue = this.isTaskOverdue(task);
        const isCompleted = task.status === "Completed";
        const isCanceled = task.status === "Canceled";
        const canComplete = !isCompleted && !isCanceled;
        const canCancel = !isCanceled && !isCompleted;

        return (
            <div
                className="modal d-block"
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-details-title"
                onMouseDown={this.handleBackdropClick}
                style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content border-0 shadow-lg overflow-hidden">
                        <div className="modal-header border-0 bg-light px-4 py-4">
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <span className={`badge bg-${this.getBadgeColor(task.status)}`}>
                                        {task.status || "Unknown"}
                                    </span>
                                    {isOverdue && (
                                        <span className="badge bg-danger-subtle text-danger">
                                            <FaExclamationTriangle className="me-1" />
                                            Overdue
                                        </span>
                                    )}
                                </div>
                                <h3 id="task-details-title" className="modal-title mb-0">
                                    {task.title || "Untitled task"}
                                </h3>
                            </div>
                            <button type="button" className="btn btn-light rounded-circle" aria-label="Close" onClick={onClose}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body p-4">
                            <div className="row g-4">
                                <div className="col-lg-8">
                                    <div className="card border-0 bg-light h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <FaAlignLeft className="text-primary" />
                                                <h5 className="mb-0">Description</h5>
                                            </div>
                                            <p className="text-body-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
                                                {task.description || "No description provided for this task."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-4">
                                            <h5 className="mb-4">Task information</h5>

                                            <div className="d-flex align-items-start gap-3 mb-4">
                                                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px" }}>
                                                    <FaUser />
                                                </div>
                                                <div>
                                                    <div className="text-body-tertiary small">Assigned user</div>
                                                    <div className="fw-semibold">{task.user?.name || "Unknown"}</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start gap-3 mb-4">
                                                <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px" }}>
                                                    <FaCalendarAlt />
                                                </div>
                                                <div>
                                                    <div className="text-body-tertiary small">Start date</div>
                                                    <div className="fw-semibold">{this.formatDate(task.start_date)}</div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start gap-3">
                                                <div className={`${isOverdue ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning"} rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: "40px", height: "40px" }}>
                                                    <FaRegClock />
                                                </div>
                                                <div>
                                                    <div className="text-body-tertiary small">Due date</div>
                                                    <div className={isOverdue ? "fw-semibold text-danger" : "fw-semibold"}>
                                                        {this.formatDate(task.due_date)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer border-0 bg-light px-4 py-3">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 w-100">
                                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                    Close
                                </button>

                                <div className="d-flex flex-wrap gap-2">
                                    {this.renderActionButton({
                                        label: "Edit",
                                        icon: <FaEdit className="me-1" />,
                                        className: "btn btn-outline-primary d-inline-flex align-items-center",
                                        onClick: onEdit ? () => onEdit(task) : undefined,
                                        disabled: !onEdit,
                                    })}
                                    {this.renderActionButton({
                                        label: "Mark completed",
                                        icon: <FaCheckCircle className="me-1" />,
                                        className: "btn btn-outline-success d-inline-flex align-items-center",
                                        onClick: onMarkComplete ? () => onMarkComplete(task) : undefined,
                                        disabled: !onMarkComplete || !canComplete,
                                    })}
                                    {this.renderActionButton({
                                        label: "Cancel task",
                                        icon: <FaBan className="me-1" />,
                                        className: "btn btn-outline-warning d-inline-flex align-items-center",
                                        onClick: onCancelTask ? () => onCancelTask(task) : undefined,
                                        disabled: !onCancelTask || !canCancel,
                                    })}
                                    {this.renderActionButton({
                                        label: "Delete",
                                        icon: <FaTrashAlt className="me-1" />,
                                        className: "btn btn-outline-danger d-inline-flex align-items-center",
                                        onClick: onDeleteTask ? () => onDeleteTask(task) : undefined,
                                        disabled: !onDeleteTask,
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskDetailsModal;