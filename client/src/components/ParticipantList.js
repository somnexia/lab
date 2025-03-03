import React, { Component } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaFileExport } from "react-icons/fa6";

class ParticipantList extends Component {
    state = {}
    render() {
        return (
            <div className='mb-5'>
                <h2 className="mb-4">
                    <span className="me-3">Projects</span>
                    <span className="fw-normal text-body-tertiary">15</span>
                </h2>
                <hr />
                <div className='mb-4'>
                    <div class="g-3 row">
                        <div class="col-auto">
                            <div class="search-box">
                                <form class="position-relative d-flex align-items-center">
                                    <input placeholder="Search members" type="search" class="search-input search form-control"></input>
                                    <FaSearch className='search-box-icon' />

                                </form>
                            </div>
                        </div>
                        <div class="scrollbar overflow-hidden-y flex-grow-1 col-auto"></div>
                        <div class="col-auto">
                            <button type="button" class="btn text-body-secondary me-4 px-0 btn btn-link text-decoration-none link-hover">
                                <span className='nav-link-icon'><FaFileExport /></span>
                                <span className='link-offset-2'>Export</span>
                            </button>

                            <button type="button" class="btn btn-primary">
                                <span className='nav-link-icon'><FaPlus /></span>
                                <span>Add participant</span>
                            </button>
                        </div>
                    </div>

                </div>
                <div className='mx-n4 px-4 mx-lg-n6 px-lg-6 bg-body-emphasis border-top border-bottom border-translucent position-relative top-1'>
                    <div className='table-responsive'>
                        <table className='table table-striped table-hover table-bordered' >
                            <thead>
                                <tr>
                                    <th className='text-nowrap'>Participant</th>
                                    <th className='text-nowrap'>Email</th>
                                    <th className='text-nowrap'>position</th>
                                    <th className='text-nowrap'>department</th>
                                    <th className='text-nowrap'>specialization</th>
                                    <th className='text-nowrap'>Laboratory</th>
                                    <th className='text-nowrap'>Last active</th>
                                    <th className='text-nowrap'>Joined</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Doe</td>
                                    <td>Project Manager</td>
                                    
                                </tr>
                            </tbody>
                        </table>

                    </div>

                </div>
            </div >
        );
    }
}

export default ParticipantList;