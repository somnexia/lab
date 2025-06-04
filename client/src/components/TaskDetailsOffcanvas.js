import React, { Component } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

class TaskDetailsOffcanvas extends Component {
    state = {}
    render() {
        return (
            <div>
                <div class="offcanvas todolist-offcancas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div class="offcanvas-header">
                        <div className='d-flex flex-between-center mb-4 gap-3'>
                            <h5 class="offcanvas-title fw-bold fs-6 mb-0 text-body-highlight line-clamp-1" id="offcanvasRightLabel">Offcanvas right</h5>
                            <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                    </div>
                    <div class="offcanvas-body">
                        <div className='mb-5'></div>
                        <div className='mb-5'></div>
                        <div className='mb-5'></div>
                        <div className='mb-5'></div>
                        <div className='mb-5'></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskDetailsOffcanvas;