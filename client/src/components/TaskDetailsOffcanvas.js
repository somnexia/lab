import React, { Component } from 'react';

class TaskDetailsOffcanvas extends Component {

    render() {

        const { isOpen, task, onClose } = this.props;

        // Если модалка закрыта — ничего не рендерим
        if (!isOpen || !task) {
            return null;
        }

        return (

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1050,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >

                {/* Sidebar */}
                <div className="modal-content"
                    style={{
                        width: '30rem',
                        height: '100%',
                        padding: '24px',
                        overflowY: 'auto',
                        boxShadow: '-2px 0 10px rgba(0,0,0,0.2)'
                    }}
                >

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <h4 className="mb-0">
                            {task.title}
                        </h4>

                        <button
                            className="btn  btn-outline-primary"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                    <hr />

                    {/* Content */}
                    

                    <div className="mb-4">
                        <strong>Description</strong>
                        <p>{task.description || 'No description'}</p>
                    </div>

                    <div className="mb-4">
                        <strong>Status</strong>
                        <p>{task.status}</p>
                    </div>

                    <div className="mb-4">
                        <strong>Assigned User</strong>
                        <p>{task.user?.name || 'Unknown'}</p>
                    </div>

                    <div className="mb-4">
                        <strong>Start Date</strong>
                        <p>{task.start_date}</p>
                    </div>

                    <div className="mb-4">
                        <strong>Due Date</strong>
                        <p>{task.due_date || '-'}</p>
                    </div>

                </div>
            </div>
        );
    }
}

export default TaskDetailsOffcanvas;