
import { IoHomeOutline } from "react-icons/io5";
import { FaFlask } from "react-icons/fa6";
import { IoFlask } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { BsBoxes } from "react-icons/bs";
import { FaRegClipboard } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { FaRegFolderClosed } from "react-icons/fa6";
import { IoFlaskSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { FaRegNewspaper } from "react-icons/fa6";
import { LuNewspaper } from "react-icons/lu";
import { IoNewspaperOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiGraduationCapLine } from "react-icons/ri";
import { LuGraduationCap } from "react-icons/lu";
import { Link } from "react-router-dom";
import React from "react";




class Aside extends React.Component {
    state = {}

    // handleOffcanvasSettingsOpen = () => {
    //     const offcanvasElement = document.getElementById("offcanvasSettings");
    //     if (offcanvasElement) {
    //         const bootstrap = require("bootstrap");
    //         const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
    //         offcanvasInstance.show();
    //     }
    // };
    // handleOffcanvasAccountOpen = () => {
    //     const offcanvasElement = document.getElementById("offcanvasAccount");
    //     if (offcanvasElement) {
    //         const bootstrap = require("bootstrap");
    //         const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
    //         offcanvasInstance.show();
    //     }
    // };
    handleOffcanvasOpen = (offcanvasId) => {
        const offcanvasElement = document.getElementById(offcanvasId);
        if (offcanvasElement) {
            const bootstrap = require("bootstrap");
            const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
            offcanvasInstance.show();
        }
    };
    render() {
        return (
            <aside>
                <div className="navbar-vertical navbar navbar-expand-lg bg-dark navbar-dark" id='navId'>
                    <div className="navbar-collapse collapse " id="navbarToggler">
                        <div className="navbar-vertical-content ">
                            <div className="vertical-nav-scroll py-3 pe-3" data-bs-spy="scroll" data-bs-target="#navId">

                                <ul className="flex-column navbar-nav" id="navbarVerticalNav" >
                                    <ul className="nav nav-pills">
                                        <li className="mb-1 lab-nav-item ">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <IoHome />

                                                    </span>
                                                    <span className="nav-link-text">
                                                        Home
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="home-collapse">
                                                <ul className=" d-flex flex-wrap d-inline-flex list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Overview</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Updates</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Reports</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <hr></hr>
                                        <h6 className="navbar-heading text-secondary">Documentation</h6>
                                        <li className="mb-1 lab-nav-item lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <FaRegClipboard />

                                                    </span>
                                                    <span className="nav-link-text">
                                                        Dashboard
                                                    </span>
                                                </div>

                                            </button>
                                            <div className="collapse" id="dashboard-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Overview</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Weekly</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Monthly</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Annually</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#tests-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <IoFlaskSharp />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Tests

                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="tests-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">New</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Processed</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Shipped</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Returned</a></li>
                                                </ul>
                                            </div>
                                        </li>

                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#projects-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <FaRegFolderClosed />


                                                    </span>
                                                    <span className="nav-link-text">
                                                        Projects
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="projects-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Overview</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#inventory-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <BsBoxes />

                                                    </span>
                                                    <span className="nav-link-text">
                                                        Inventory
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="inventory-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><Link to="/inventory" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Overview</Link></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#equipment-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <BsBoxes />

                                                    </span>
                                                    <span className="nav-link-text">
                                                        Equipment
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="equipment-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><Link to="/equipment" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Overview</Link></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <LuClipboardList />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Orders
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="orders-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">New...</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#reports-collapse" aria-expanded="false">

                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <IoNewspaperOutline />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Reports
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="reports-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">New...</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link btn btn-dark text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                    <hr></hr>
                                    <h6 className="navbar-heading text-secondary">Documentation</h6>

                                    <ul className="nav nav-bottom nav-pills">

                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#activities-collapse" aria-expanded="false">
                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <RxDashboard />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Activities
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="activities-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#teams-collapse" aria-expanded="false">
                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <GrGroup />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Teams
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="teams-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark dropdown-toggle collapsed" data-bs-toggle="collapse" data-bs-target="#tutorials-collapse" aria-expanded="false">
                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <RiGraduationCapLine />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Tutorials
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="collapse" id="tutorials-collapse">
                                                <ul className="nav-tabs list-unstyled fw-normal pb-1 small">
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">New...</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Profile</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Settings</a></li>
                                                    <li><a href="#" className="nav-link text-light d-inline-flex text-decoration-none rounded">Sign out</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className='mt-auto'></div>
                                    <ul className="nav nav-pills pt-3 pb-2">
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark collapsed" role="button"
                                                onClick={() => this.handleOffcanvasOpen("offcanvasSettings")}>
                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <FaRegUserCircle />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Account
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                        <li className="mb-1 lab-nav-item">
                                            <button className="btn btn-dark collapsed" role="button"
                                                onClick={() => this.handleOffcanvasOpen("offcanvasAccount")}>
                                                <div className='d-flex align-items-center'>
                                                    <span className="nav-link-icon">
                                                        <IoSettingsOutline />
                                                    </span>
                                                    <span className="nav-link-text">
                                                        Settings
                                                    </span>
                                                </div>
                                            </button>

                                        </li>



                                    </ul>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-vertical-footer">
                        <button type="button" className="btn  navbar-vertical-toggle fw-semibold  white-space-nowrap d-flex align-items-center" typeof='button' data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-expanded="false" aria-controls="navbarToggler">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
                                <path d="M21,11H9.41l2.3-2.29a1,1,0,1,0-1.42-1.42l-4,4a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l4,4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H21a1,1,0,0,0,0-2ZM3,3A1,1,0,0,0,2,4V20a1,1,0,0,0,2,0V4A1,1,0,0,0,3,3Z"></path>
                            </svg><span className="ms-2">Collapsed View</span>
                        </button>
                    </div>
                </div>

            </aside>

        );

    }
}

export default Aside;
