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

    renderActionButton = ({ label, icon, tone, onClick, disabled }) => (
        <button
            type="button"
            className={`task-modal__action task-modal__action--${tone}`}
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
                className="task-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-details-title"
                onMouseDown={this.handleBackdropClick}
            >
                <section className="task-modal__panel" onMouseDown={(event) => event.stopPropagation()}>
                    <header className="task-modal__header">
                        <div>
                            <div className="task-modal__status-line">
                                {this.renderStatusPill(task.status)}
                                {isOverdue && (
                                    <span className="task-status task-status--danger">
                                        <FaExclamationTriangle />
                                        Overdue
                                    </span>
                                )}
                            </div>
                            <h2 id="task-details-title">{task.title || "Untitled task"}</h2>
                        </div>
                        <button type="button" className="task-modal__close" aria-label="Close" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </header>

                    <div className="task-modal__body">
                        <article className="task-modal__description">
                            <div className="task-modal__section-title">
                                <FaAlignLeft />
                                <h3>Description</h3>
                            </div>
                            <p>{task.description || "No description provided for this task."}</p>
                        </article>

                        <aside className="task-modal__info" aria-label="Task information">
                            <h3>Task information</h3>

                            <div className="task-modal__info-item">
                                <span className="task-modal__info-icon task-modal__info-icon--primary">
                                    <FaUser />
                                </span>
                                <div>
                                    <p>Assigned user</p>
                                    <strong>{task.user?.name || "Unknown"}</strong>
                                </div>
                            </div>

                            <div className="task-modal__info-item">
                                <span className="task-modal__info-icon task-modal__info-icon--success">
                                    <FaCalendarAlt />
                                </span>
                                <div>
                                    <p>Start date</p>
                                    <strong>{this.formatDate(task.start_date)}</strong>
                                </div>
                            </div>

                            <div className="task-modal__info-item">
                                <span className={isOverdue ? "task-modal__info-icon task-modal__info-icon--danger" : "task-modal__info-icon task-modal__info-icon--warning"}>
                                    <FaRegClock />
                                </span>
                                <div>
                                    <p>Due date</p>
                                    <strong className={isOverdue ? "task-modal__danger-text" : ""}>
                                        {this.formatDate(task.due_date)}
                                    </strong>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <footer className="task-modal__footer">
                        <button type="button" className="task-modal__secondary" onClick={onClose}>
                            Close
                        </button>

                        <div className="task-modal__actions">
                            {this.renderActionButton({
                                label: "Edit",
                                icon: <FaEdit />,
                                tone: "primary",
                                onClick: onEdit ? () => onEdit(task) : undefined,
                                disabled: !onEdit,
                            })}
                            {this.renderActionButton({
                                label: "Mark completed",
                                icon: <FaCheckCircle />,
                                tone: "success",
                                onClick: onMarkComplete ? () => onMarkComplete(task) : undefined,
                                disabled: !onMarkComplete || !canComplete,
                            })}
                            {this.renderActionButton({
                                label: "Cancel task",
                                icon: <FaBan />,
                                tone: "warning",
                                onClick: onCancelTask ? () => onCancelTask(task) : undefined,
                                disabled: !onCancelTask || !canCancel,
                            })}
                            {this.renderActionButton({
                                label: "Delete",
                                icon: <FaTrashAlt />,
                                tone: "danger",
                                onClick: onDeleteTask ? () => onDeleteTask(task) : undefined,
                                disabled: !onDeleteTask,
                            })}
                        </div>
                    </footer>
                </section>
            </div>
        );
    }
}

export default TaskDetailsModal;
