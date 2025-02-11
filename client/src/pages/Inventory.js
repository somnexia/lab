import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Component } from 'react'
import { Outlet, Link } from "react-router-dom";



class Inventory extends Component {
    state = {}
    render() {
        return (
            <div>

                <h2>Inventory</h2>
                <hr></hr>
                <div className='row justify-content-between py-4'>
                    <div className='col-12 col-sm-4 col-xl-3 mb-5 mb-sm-0'>
                        <div className="card lab-nav-card card-reset  ">
                            <div className="card-body p-0">
                                <div className="row g-3 ">
                                    <div className="col-sm-6 col-4 col-xxl-5">
                                        <div className="card text-bg-dark">
                                            <div className="card-body p-0">
                                                <Link to="/inventory/overview" className="btn btn-lab square-button text-start w-100">

                                                    <div className="fw-bold pt-2">
                                                        Overview
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-4 col-xxl-5">
                                        <div className="card text-bg-dark">
                                            <div className="card-body p-0">
                                                <Link to="/inventory/warehouses" className="btn btn-lab square-button   text-start w-100">

                                                    <div className="fw-bold  pt-2">
                                                        Warehouses
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-4 col-xxl-5">
                                        <div className="card text-bg-dark">
                                            <div className="card-body p-0">
                                                <Link to="/inventory/storage-units" className="btn btn-lab square-button  text-start w-100">

                                                    <div className="fw-bold  pt-2">
                                                        Storage Units

                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-4 col-xxl-5">
                                        <div className="card text-bg-dark">
                                            <div className="card-body p-0">
                                                <Link to="/inventory/ladder" className="btn btn-lab square-button  text-start w-100">

                                                    <div className="fw-bold  pt-2">
                                                        ladder
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-4 col-xxl-5">
                                        <div className="card text-bg-dark">
                                            <div className="card-body p-0">
                                                <Link to="/inventory/dropdown" className="btn btn-lab square-button  text-start w-100">

                                                    <div className="fw-bold  pt-2">
                                                        dropdown
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-4  col-xxl-5">
                                        <div className="card text-bg-dark text-white ">
                                            <div className="card-body p-0">
                                                <Link to="/inventory/location" className="btn btn-lab square-button  text-start w-100">

                                                    <div className="fw-bold  pt-2">
                                                        Locations
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='col-12 col-sm-8 col-xxl-9 mb-5 '>
                        <Outlet />



                    </div>
                </div>
            </div >
        );
    }
}

export default Inventory;