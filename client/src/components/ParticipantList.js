import React, { Component } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaFileExport } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { format } from 'date-fns';

class ParticipantList extends Component {
    state = {
        employees: [], // Список сотрудников
    };

    componentDidMount() {
        this.fetchEmployees();
    }

    // Метод для загрузки сотрудников с сервера
    fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/employees'); // Запрос к API
            this.setState({ employees: response.data });
        } catch (error) {
            console.error('Ошибка при загрузке сотрудников:', error);
        }
    };

    render() {
        const { employees } = this.state;

        return (
            <div className='mb-5'>
                <h2 className="mb-4">
                    <span className="me-3">Projects</span>
                    <span className="fw-normal text-body-tertiary">{employees.length}</span>
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
                <div className='mx-n4 px-4 mx-lg-n6 px-lg-6  border-top border-bottom border-translucent position-relative top-1'>
                    <div className='table-responsive p-1'>
                        <table className='table table-striped table-hover' >
                            <thead>
                                <tr >
                                    <th class="" >
                                        <div class="form-check mb-0">
                                            <input type="checkbox" class="form-check-input"></input>
                                        </div>
                                    </th>
                                    <th className='text-uppercase ' style={{ minWidth: "200px" }}>Participant</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }} >Email</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }}>position</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }}>department</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }}>specialization</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }}>Laboratory</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }}>Last active</th>
                                    <th className='text-uppercase' style={{ minWidth: "170px" }}>Joined</th>

                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>
                                            <div class="form-check mb-0">
                                                <input type="checkbox" class="form-check-input"></input>
                                            </div>
                                        </td>
                                        <td class="py-3">{employee.name}</td>
                                        <td class="py-3">{employee.email}</td>
                                        <td class="py-3">{employee.position}</td>
                                        <td class="py-3">{employee.department}</td>
                                        <td class="py-3">{employee.specialization}</td>
                                        <td class="py-3">{employee.laboratory?.lab_name || 'N/A'}</td>
                                        <td class="py-3">{employee.updatedAt || 'N/A'}</td>
                                        <td class="py-3"><p>{format(new Date(employee.createdAt), 'dd.MM.yyyy')}</p>
                                            <p>{format(new Date(employee.createdAt), 'hh:mm a')}</p>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div class="align-items-center py-2 row">
                        <div class="d-flex fs-7 col align-items-center">
                            <p class="mb-0 d-none d-sm-block me-3 fw-semibold ">1 to {employees.length}
                                <span class="text-body-secondary fw-light"> items of </span>{employees.length}
                            </p>
                            <button type="button" class="p-0 fs-7 fw-semibold btn  d-flex align-items-center btn-link text-decoration-none link-primary ">
                                <span >View all</span>
                                <span className='nav-link-icon'><FaChevronRight /></span>


                            </button>
                        </div>
                        <div class="col-auto">
                            <ul class="mb-0 justify-content-center pagination">
                                <li class="page-item disabled">
                                    <span class="page-link">
                                        <span aria-hidden="true"><FaChevronLeft /></span>
                                        <span class="visually-hidden">Previous</span>
                                    </span>
                                </li>
                                <li class="page-item active ">
                                    <span class="page-link">1
                                        <span class="visually-hidden">(current)</span>
                                    </span>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" role="button" href="#">2</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" role="button" href="#">
                                        <span aria-hidden="true"><FaChevronRight /></span>
                                        <span class="visually-hidden">Next</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div >
        );
    }
}

export default ParticipantList;