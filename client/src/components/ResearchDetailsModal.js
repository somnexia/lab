import React, { Component } from 'react';
import axios from 'axios';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { FaShareNodes } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { FaPenAlt } from "react-icons/fa";
import { format } from 'date-fns';
import { FaPaperclip } from "react-icons/fa6";
import { FaEllipsis } from "react-icons/fa6";
import { FaFileZipper } from "react-icons/fa6";
import { FaFileLines } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";




class ResearchDetailsModal extends Component {
    state = {
        showMore: false,
        deadline: null,
        tasks: [],  // Список задач
        loadingTasks: false,
        errorTasks: null,
    }



    handleBackdropClick = (e) => {
        const { onClose } = this.props;
        // Закрываем модальное окно, если клик был на фоне (а не на содержимом модального окна)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    toggleShowMore = () => {
        this.setState((prevState) => ({ showMore: !prevState.showMore }));
    };

    handleDeadlineChange = (date) => {
        this.setState({ deadline: date });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentDidMount() {
        this.fetchTasks();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.research?.id !== this.props.research?.id) {
            this.fetchTasks();
        }
    }

    fetchTasks = async () => {
        const { research } = this.props;
        if (!research?.id) return;

        this.setState({ loadingTasks: true, errorTasks: null });

        try {
            const response = await axios.get(`http://localhost:3000/api/tasks?researchId=${research.id}`);
            this.setState({ tasks: response.data, loadingTasks: false });
        } catch (error) {
            console.error("research",);
            console.error("Ошибка загрузки задач:", error);
            this.setState({ errorTasks: "Не удалось загрузить задачи", loadingTasks: false });
        }
    };


    render() {
        const {
            isOpen,
            research,
            relatedData,
            onClose,
            loading,
            error,
        } = this.props;
        const { showMore, tasks, loadingTasks, errorTasks } = this.state;



        if (!isOpen) return null;

        return (
            <div
                className="modal fade lab-modal-backdrop p-0 show"
                id="researchDetailsModal"
                role="dialog"
                tabIndex={-1}
                aria-describedby="researchDetailsModalDescription"
                aria-labelledby="researchDetailsModalLabel"
                style={{ display: isOpen ? 'block' : 'none' }}
                aria-hidden={!isOpen}
                aria-modal="true"
                onClick={this.handleBackdropClick} // Обработка клика на фон
            >
                <div className="modal-dialog  modal-xl" onClick={(e) => e.stopPropagation()} >
                    <div className="modal-content">
                        <div className="modal-header position-relative p-0">
                            <button
                                onClick={onClose}
                                type="button"
                                className="btn-close position-absolute end-0 top-0 mt-3 me-3"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                            <img
                                src="/images/43.824783eab918239b78da.png"
                                alt="cover"
                                className="w-100"
                                style={{ minHeight: "150px", maxHeight: "280px" }}
                            ></img>
                        </div>
                        <div className="modal-body p-0">

                            {loading && <p>Загрузка связанных данных...</p>}

                            <div className='gx-0 gy-3 border-bottom px-5 px-lg-5 py-4 p-xl-0 row'>
                                <div className="border-end col-xl-5 col-12 ">
                                    <div className="h-100 align-items-center px-xl-5 justify-content-between justify-content-xl-start row">
                                        <div className="col-auto">
                                            <div>
                                                <p className="text-body-tertiary fw-semibold mb-0">Created</p>
                                                <p className="text-body-highlight mb-0">Jan 3, 3:24 pm</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-7">
                                            <div className="form-floating">
                                                <DatePicker
                                                    name="deadline"
                                                    type="text"
                                                    selected={this.state.deadline}
                                                    onChange={this.handleDeadlineChange}
                                                    className={`form-control ${this.state.errors?.deadline ? 'is-invalid' : ''}`}
                                                    dateFormat="yyyy-MM-dd"
                                                    placeholder="Deadline"
                                                    id='deadline'
                                                    onFocus={() => this.setState({ isFocused: true })}
                                                    onBlur={() => this.setState({ isFocused: !!this.state.deadline })}>

                                                </DatePicker>
                                                <label htmlFor="deadline" className={this.state.isFocused ? 'active' : ''}>Deadline</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-7 col-12">
                                    <div className="px-xl-5 py-xl-4">
                                        <div className="d-flex gap-2 justify-content-between align-items-center">
                                            <div className="d-flex gap-2">
                                                <div className="dropdown">
                                                    <button type="button" id="" aria-expanded="false" className="btn-outline-secondary d-none d-sm-block btn dropdown-toggle dropdown-caret-none d-flex align-items-center">
                                                        Add to card <FaPlus />

                                                    </button>
                                                </div>

                                                <div className="dropdown d-flex align-items-center">
                                                    <button type="button" data-bs-toggle="dropdown" id="react-aria7113992956-:r4n:" aria-expanded="false" enable-caret="false" className="btn rounded-2 btn-icon btn-icon-lg me-2 dropdown-caret-none btn-outline-secondary dropdown-toggle">
                                                        <FaEllipsisVertical />

                                                    </button>

                                                    <div x-placement="bottom-end" aria-labelledby="react-aria7113992956-:r4n:" className="dropdown-menu dropdown-menu-end" data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="bottom-end" style={{ position: 'absolute', inset: '0px 0px auto auto', transform: 'translate3d(-8px, 40px, 0px)' }}>
                                                        <div className="px-2 d-flex flex-column gap-2">


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <div className="dropdown">
                                                    <button type="button" id="react-aria7113992956-:r4o:" aria-expanded="false" className="btn-outline-info dropdown-caret-none d-flex align-items-center dropdown-toggle btn btn-subtle-info">
                                                        Review
                                                        <FaAngleDown className='ms-2' />
                                                    </button>
                                                    <div aria-labelledby="react-aria7113992956-:r4o:" className="py-2 dropdown-menu dropdown-menu-end" style={{ position: 'absolute', inset: '0px 0px auto auto', transform: 'translate3d(-184px, 273.5px, 0px)' }}>
                                                        <a aria-selected="false" className="dropdown-item" role="button" tabIndex="0" href="#">View</a>
                                                        <a aria-selected="false" className="dropdown-item" role="button" tabIndex="0" href="#">Export</a>
                                                        <hr className="dropdown-divider" role="separator"></hr>
                                                        <a aria-selected="false" data-rr-ui-dropdown-item="" className="text-danger dropdown-item" role="button" tabIndex="0" href="#">Remove</a>
                                                    </div>
                                                </div>
                                                <button type="button" className="btn-icon btn-outline-secondary btn-icon-lg btn btn-subtle-secondary">
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='g-0 row'>
                                <div className='border-end bg-body-highlight col-xl-5 col-12'>
                                    <div className='px-5 px-lg-5 py-4 bg-body-emphasis'>
                                        <h3 className='align-middle fw-bolder lab-text-primary lh-sm mb-4'>{research?.title || "Название отсутствует"}
                                            <span className='text-secondary ps-3 fs-5 h-100'>({research?.type})</span>
                                        </h3>


                                        <span
                                            className={`py-1 px-4 fs-6 badge fw-bold lh-1 mb-5 bg-opacity-25 border text-uppercase text-bg-${research.status === "Completed"
                                                ? "success"
                                                : research.status === "Ongoing"
                                                    ? "info"
                                                    : research.status === "Pending"
                                                        ? "warning"
                                                        : "danger"
                                                } text-${research.status === "Completed"
                                                    ? "success"
                                                    : research.status === "Ongoing"
                                                        ? "info"
                                                        : research.status === "Pending"
                                                            ? "warning"
                                                            : "danger"
                                                } border-${research.status === "Completed"
                                                    ? "success"
                                                    : research.status === "Ongoing"
                                                        ? "info"
                                                        : research.status === "Pending"
                                                            ? "warning"
                                                            : "danger"
                                                }`}
                                            style={{ letterSpacing: "0" }}
                                        >
                                            {research.status}
                                        </span>

                                        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

                                        <div className="d-flex align-items-center mb-5">
                                            <p className="text-body-highlight fw-700 mb-0 me-2">100%</p>
                                            <div className="progress flex-fill bg-success bg-opacity-25" style={{ height: ".450rem" }}>
                                                <div role="progressbar" className="progress-bar bg-success bg-gradient" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: "75%" }}></div>
                                            </div>
                                        </div>
                                        <div className='mb-4'>
                                            <h6 className='text-body-secondary mb-2'>Assigness</h6>
                                            <div className='d-flex gap-1'>
                                                <div className='dropdown'>
                                                    <button type="button" id="react-aria1559520475-:r1h:" aria-expanded="false" className="dropdown-caret-none p-0 dropdown-toggle btn">
                                                        <div className="avatar avatar-m">
                                                            <FaRegUserCircle className='avatar-icon' />
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className='dropdown'>
                                                    <button type="button" id="react-aria1559520475-:r1h:" aria-expanded="false" className="dropdown-caret-none p-0 dropdown-toggle btn">
                                                        <div className="avatar avatar-m">
                                                            <FaRegUserCircle className='avatar-icon' />
                                                        </div>
                                                    </button>
                                                </div>
                                                <button type="button" className="btn-circle btn btn-secondary">
                                                    <FaPlus />
                                                </button>

                                            </div>

                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <p className="fw-bold mb-0 text-truncate lh-1">Scope:
                                                <span className="fw-semibold text-body-secondary">Clinical trial</span>
                                            </p>
                                        </div>
                                        <div className="d-flex align-items-center mb-5">
                                            <p className="fw-bold mb-0 text-truncate lh-1">Research object:
                                                <span className="fw-semibold text-body-secondary">Hypertension patients</span>
                                            </p>
                                        </div>
                                        <div className="mb-5">
                                            <h6 className="text-body-secondary mb-2">References</h6>
                                            <div className="d-flex gap-2 align-items-center">
                                                <span
                                                    className={`fs-10 badge fw-bold lh-1 bg-opacity-25 border text-uppercase text-bg-${research.status === "Completed"
                                                        ? "success"
                                                        : research.status === "Ongoing"
                                                            ? "info"
                                                            : research.status === "Pending"
                                                                ? "warning"
                                                                : "danger"
                                                        } text-${research.status === "Completed"
                                                            ? "success"
                                                            : research.status === "Ongoing"
                                                                ? "info"
                                                                : research.status === "Pending"
                                                                    ? "warning"
                                                                    : "danger"
                                                        } border-${research.status === "Completed"
                                                            ? "success"
                                                            : research.status === "Ongoing"
                                                                ? "info"
                                                                : research.status === "Pending"
                                                                    ? "warning"
                                                                    : "danger"
                                                        }`}
                                                    style={{ letterSpacing: "0" }}
                                                >
                                                    {research.status}
                                                </span>
                                                <span
                                                    className={`fs-10 badge fw-bold lh-1 bg-opacity-25 border text-uppercase text-bg-${research.status === "Completed"
                                                        ? "success"
                                                        : research.status === "Ongoing"
                                                            ? "info"
                                                            : research.status === "Pending"
                                                                ? "warning"
                                                                : "danger"
                                                        } text-${research.status === "Completed"
                                                            ? "success"
                                                            : research.status === "Ongoing"
                                                                ? "info"
                                                                : research.status === "Pending"
                                                                    ? "warning"
                                                                    : "danger"
                                                        } border-${research.status === "Completed"
                                                            ? "success"
                                                            : research.status === "Ongoing"
                                                                ? "info"
                                                                : research.status === "Pending"
                                                                    ? "warning"
                                                                    : "danger"
                                                        }`}
                                                    style={{ letterSpacing: "0" }}
                                                >
                                                    {research.status}
                                                </span>
                                                <button type="button" className="p-0 fs-8 text-body-tertiary fw-bolder text-decoration-none lh-1 btn btn-link">
                                                    <FaPlus />
                                                    Add another
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="d-flex align-items-center mb-2">
                                                <h5 className="me-4">Description</h5>
                                                <button type="button" className="text-decoration-none p-0 btn btn-link">
                                                    <FaPenAlt />
                                                </button>
                                            </div>
                                            <p className="text-body-secondary mb-0" style={{ LineClamp: "1", WebkitLineClamp: "1" }}>{research?.goal}
                                                <a className="d-inline fw-bolder text-decoration-none ps-2" href="">see more</a>
                                            </p>


                                        </div>


                                    </div>
                                    <div className='px-5 px-lg-6 py-4'>
                                        {showMore && (
                                            <div className="card mt-4 shadow-sm">
                                                <div className="card-header bg-body-emphasis text-white">
                                                    <h6 className="mb-0">Research Details</h6>
                                                </div>
                                                <div className="card-body bg-body-emphasis">
                                                    <p><strong>Discription:</strong> {research?.goal}</p>
                                                    <p><strong>Safety Info:</strong> {research?.funding_source}</p>
                                                </div>
                                            </div>

                                        )}
                                        <button type="button" className="dropdown-toggle btn btn-lab mt-4" onClick={this.toggleShowMore}>
                                            {showMore ? 'View Less' : 'View More'}
                                        </button>

                                    </div>

                                </div>
                                <div className='col-xl-7 col-12'>
                                    <div className='px-5 px-lg-6 pt-4 pb-5 pb-lg-6'>
                                        <div className='mb-5'>
                                            <h5 className="mb-4">To do list
                                                <span className="text-body-tertiary fw-normal fs-6">(23)</span>
                                            </h5>

                                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-x-5 gap-y-3 mb-3">
                                                <div className="search-box" style={{ maxWidth: "30rem" }}>
                                                    <form className="position-relative">
                                                        <input placeholder="Search tasks" type="search" className="search-input search form-control">
                                                        </input>
                                                    </form>

                                                </div>
                                            </div>
                                            {loadingTasks && <p>Загрузка задач...</p>}
                                            {errorTasks && <p className="text-danger">{errorTasks}</p>}
                                            <div className='mb-4'>
                                                {tasks.map((task) =>
                                                (
                                                    <div key={task.id} className='py-3 border-top d-flex align-items-center hover-actions-trigger border-bottom border-translucent gap-2 todolist-item'>
                                                        <input type="checkbox" className="flex-shrink-0 my-0 align-self-start form-check-input"></input>
                                                        <div className="justify-content-between align-items-center btn-reveal-trigger border-translucent gx-0 flex-grow-1 gy-1 row">
                                                            <div className="col-lg-auto col-12">
                                                                <div className="d-flex align-items-center lh-1 gap-2">
                                                                    <h6 className="mb-0 line-clamp-1 fw-semibold text-body-tertiary cursor-pointer">{task.title}</h6>
                                                                    <span className="fs-10 ms-auto badge-phoenix badge-phoenix-primary badge"> {task.status.toUpperCase()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-auto col-12">
                                                                <div className="d-flex lh-1 align-items-center">
                                                                    <button type="button" className="p-0 text-body-tertiary fs-10 me-2 btn">
                                                                        <FaPaperclip className='me-1' />

                                                                        2</button>
                                                                    <p className="me-lg-3 text-body-tertiary fs-10 me-2 mb-0">{new Date(task.start_date).toLocaleDateString()}</p>
                                                                    <div className="hover-lg-hide">
                                                                        <p className="ps-lg-3 text-body-tertiary fs-10 ps-lg-3 border-start fw-bold mb-md-0 mb-0">
                                                                            {format(new Date(`1970-01-01T${task.reminder}`), 'hh:mm a')}
                                                                        </p>
                                                                        {/* или Встроенный метод toLocaleTimeString()
                                                                        1970-01-01T${task.Reminder} – превращает строку 12:00:00 в корректную дату.
                                                                        toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true }) – форматирует в 12:00 PM

                                                                        <p className="ps-lg-3 text-body-tertiary fs-10 ps-lg-3 border-start-lg fw-bold mb-md-0 mb-0">
                                                                            {new Date(`1970-01-01T${task.Reminder}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                        </p> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="d-lg-block d-none end-0 position-absolute" style={{ top: "50rem" }}>
                                                            <div className="hover-actions end-0">
                                                                <button type="button" className="btn-icon fs-10 me-1 btn btn-phoenix-secondary">

                                                                </button>

                                                                <button type="button" className="btn-icon fs-10 btn btn-phoenix-secondary">

                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" className="text-decoration-none p-0 btn btn-link">
                                                <FaPlus />
                                                Add new task
                                            </button>

                                        </div>
                                        <div>
                                            <h5 className='mb-3'>Files</h5>
                                            <hr />
                                            <div className='mb-3'>
                                                <div className='border-bottom py-4'>
                                                    <div className='d-flex justify-content-between align-items-start'>
                                                        <div>
                                                            <div class="d-flex align-items-center mb-1">
                                                                <FaFileZipper className='me-1' />
                                                                <p class="text-body-highlight mb-0 lh-1">All_images.zip</p>
                                                            </div>
                                                            <div class="d-flex fs-9 text-body-tertiary flex-wrap">
                                                                <span>12.8 mb</span>
                                                                <span class="text-body-quaternary mx-1">| </span>
                                                                <a href="#!">Yves Tanguy</a>
                                                                <span class="text-body-quaternary mx-1">| </span>
                                                                <span class="text-nowrap">19th Dec, 08:56 PM</span>
                                                            </div>
                                                        </div>


                                                        <div class="btn-reveal-trigger">
                                                            <div class="dropdown">
                                                                <button type="button" id="" class="btn-outline-secondary border-0 dropdown-caret-none transition-none dropdown-toggle btn btn-sm">

                                                                    <FaEllipsis />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                </div>

                            </div>





                            {/* <div className='row gap-3'>
                                <div className='col-xl-10 col-12'>


                                </div>
                                <div className='inventory-modal-actions row px-0 col-xl-2 col-11 mt-0'>
                                    <div className='dropdown ' >
                                        <a role="button" className={`btn dropdown-toggle py-2 w-100 text-bg-${status === "available" ? "success" : status === "in use" ? "warning" : status === "reserved" ? "info" : "danger"}`} href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                            {status === "available" ? "Available" : status === "in use" ? "In Use" : status === "reserved" ? "Reserved" : "Out Of Stock"}
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("available")}
                                                >
                                                    Set "Available"
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("reserved")}
                                                >
                                                    Set "Reserved"
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("in use")}
                                                >
                                                    Set "In Use"
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.handleStatusChange("out of stock")}
                                                >
                                                    Set "Out Of Stock"
                                                </button>
                                            </li>

                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="text-body-secondary">Quick Actions</h5>
                                        <div className='d-flex flex-column gap-2'>
                                            <button onClick={() => addToCart(inventory)} type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaCartPlus /><span className='ps-2'></span>Add To Cart</button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'>< FaHistory /><span className='ps-2'>Mark as Favorite</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaBell /><span className='ps-2'>Set Reminder</span></button>

                                        </div>
                                    </div>


                                    <div className="mt-auto"></div>
                                    <div>
                                        <h5 className="text-body-secondary">Management Actions</h5>
                                        <div className="d-flex flex-column gap-2">
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaArrowRightLong /><span className='ps-2'>Move</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaRegCopy /><span className='ps-2'>Dublicate</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaTrashAlt /><span className='ps-2'>Remove</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaBoxArchive /><span className='ps-2'>Archive</span></button>
                                            <button type='button' className='w-100 p-2 text-start btn-outline-secondary btn btn-sm'><FaShareNodes /><span className='ps-2'>Shate</span></button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                    </div>
                </div>
            </div >

        );
    }

}

export default ResearchDetailsModal;