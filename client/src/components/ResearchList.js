import React, { Component } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ResearchDetailsModal from './ResearchDetailsModal';


class ResearchList extends Component {
    state = {
        researches: [],  // Храним список исследований
        statusCounts: {},  // Храним количество исследований по статусам
        selectedStatus: "All",
        modalLoading: false,
        error: null,
        isModalOpen: false,
        selectedResearch: null,

    };

    componentDidMount() {
        this.fetchResearches();
    }

    fetchResearches = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/researches');
            const researches = response.data;

            // Подсчитываем количество исследований в каждом статусе
            const statusCounts = researches.reduce((acc, research) => {
                acc[research.status] = (acc[research.status] || 0) + 1;
                return acc;
            }, {});

            this.setState({ researches, statusCounts });
            console.log("researches", researches)
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    };
    handleStatusFilter = (status) => {
        this.setState({ selectedStatus: status });
    };
    openModal = async (research) => {
        try {
            this.setState({
                selectedResearch: research,
                isModalOpen: true,
                modalLoading: true,
                error: null,
            });
            console.log('Данные research:', research);

            const researchResponse = await axios.get(`http://localhost:3000/api/researches/${research.id}`);
            const researchData = researchResponse.data;
             
            console.log('Данные research: researchData', researchData);

            const fullResearch = {
                ...research,
                ...researchData,
            }
            console.log('Объект, передаваемый в ResearchDetailsModal fullResearch:', fullResearch);

            this.setState({
                selectedResearch: fullResearch,
                modalLoading: false,
            });

        } catch (error) {
            console.error('Ошибка при загрузке связанных данных:', error);
            this.setState({ error: 'Не удалось загрузить связанные данные', modalLoading: false });
        }
    };
    closeModal = () => {
        this.setState({
            isModalOpen: false,
            selectedResearch: null,
            relatedData: [],
        });
    };



    render() {
        const { researches, statusCounts, selectedResearch, loading,
            modalLoading,
            error,
            isModalOpen, } = this.state;
        const formatDate = (dateString) => dateString.split('T')[0];

        const filteredResearches = this.state.selectedStatus === "All"
            ? this.state.researches
            : this.state.researches.filter(research => research.status === this.state.selectedStatus);

        return (
            <div>
                <div className="d-flex flex-wrap mb-4 gap-3 gap-sm-5 align-items-center">
                    <h2 className="mb-0">
                        <span className="me-3">Projects</span>
                        <span className="fw-normal text-body-tertiary">({researches.length})</span>
                    </h2>
                    <Link className="btn btn-primary px-5 d-flex align-items-center" to="/projects/research-create">
                        <span className='nav-link-icon'><FaPlus /></span>
                        <span>Add new research</span>
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
                                    All <span className="text-body-tertiary fw-semibold">({this.state.researches.length})</span>
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
                                    <input className="form-control me-2 search-input" type="search" placeholder="Search researches" aria-label="Search researches"></input>
                                    <FaSearch className='search-box-icon' />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Список исследований */}
                <div className='g-3 mb-9 row'>
                    {filteredResearches.map(research => (
                        <div key={research.id} className='col-xxl-3 col-xl-4 col-sm-6 col-12'>
                            <div className='h-100 hover-actions-trigger card'>
                                <div className='card-body'>
                                    <div className='d-flex align-items-center'>
                                        <h4 className="text-truncate lh-sm flex-1 me-3">{research.title}</h4>
                                        <div className="hover-actions">
                                            <button onClick={() => this.openModal(research)}  type="button" className="btn btn-icon btn-primary"><FaChevronRight /></button>
                                        </div>
                                    </div>
                                    <span className="mb-4 badge">{research.status}</span>
                                    <div className='d-flex align-items-center mb-2'>
                                        <p className="fw-bold mb-0 text-truncate lh-1">Scope: <span className="fw-semibold text-body-secondary">{research.scope}</span></p>
                                    </div>
                                    <div className='d-flex align-items-center mb-4'>
                                        <p className="fw-bold mb-0 text-truncate lh-1">Research object: <span className="fw-semibold text-body-secondary">{research.research_object}</span></p>
                                    </div>
                                    <div className="d-flex justify-content-between text-body-tertiary">
                                        <p className="mb-2">Progress</p>
                                        <p className="mb-2 text-body-primary">{research.progress}%</p>
                                    </div>
                                    <div className="flex-1 bg-success-subtle progress">
                                        <div role="progressbar" className="progress-bar bg-success" style={{ width: `${research.progress}%` }}></div>
                                    </div>
                                    <div className="d-flex align-items-center mt-4">
                                        <p className="mb-0 fw-bold">Started: <span className="fw-semibold text-body-tertiary ms-1">{formatDate(research.end_date)}</span></p>
                                    </div>
                                    <div className="d-flex align-items-center mt-2">
                                        <p className="mb-0 fw-bold">Deadline: <span className="fw-semibold text-body-tertiary ms-1">{formatDate(research.start_date)}</span></p>
                                    </div>
                                    <div className='d-flex d-lg-block d-xl-flex justify-content-between align-items-center mt-3'>
                                        <div className='d-flex gap-1'>
                                            <div className='avatar-group'>
                                                {/* Здесь можно добавить аватары участников */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedResearch && (
                    <ResearchDetailsModal
                        isOpen={isModalOpen}
                        research={selectedResearch}
                        onClose={this.closeModal}
                        loading={modalLoading}
                        error={error}
                    />
                )}
            </div>
        );
    }
}

export default ResearchList;