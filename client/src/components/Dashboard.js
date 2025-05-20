import React, { Component } from 'react';
import axios from 'axios';
import OverviewCard from './OverviewCard';
import { FaFlask } from 'react-icons/fa';
import { FaMicroscope } from "react-icons/fa6";
import { GiArchiveResearch } from "react-icons/gi";
import { FaCartArrowDown } from "react-icons/fa";


import {
    ClipboardList,
    PlusCircle,
    RefreshCw,
    Search,
    TrendingUp,
} from 'lucide-react'

class Dashboard extends Component {
    state = {}


    render() {
        
        const overviewCardData = [
            {
                id: 1,
                Icon: FaFlask,
                color: 'bg-info text-white',
                title: 'Chemicals',
                itemType: 'chemicals',
            },
            {
                id: 2,
                Icon: FaMicroscope,
                color: 'bg-success text-white',
                title: 'Equipment',
                itemType: 'equipment',
            },
            {
                id: 3,
                Icon: GiArchiveResearch ,
                color: 'bg-purple text-white',
                title: 'Ongoing Researches',
                itemType: 'researches',
            },
            {
                id: 4,
                Icon: FaCartArrowDown ,
                color: 'bg-warning text-white',
                title: 'Active Orders',
                itemType: 'orders',
            },


           
        ];


        return (
            <div className="flex-grow py-4">
                <div className="container">
                    <div className="mb-5">
                        <h1 className="h4 fw-semibold ">
                            Laboratory Inventory Dashboard
                        </h1>
                        <p className="secondary-color small mt-1">
                            Welcome back! Here's an overview of your laboratory inventory.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-5">
                        <h2 className="h5 mb-3 ">Quick Actions</h2>
                        <div className="row g-3">
                            <div className="col-6 col-md-3">
                                <button className="btn btn-light w-100 d-flex flex-column align-items-center justify-content-center border shadow-sm p-3">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 mb-2">
                                        <Search size={24} className="text-primary" />
                                    </div>
                                    <span className="small fw-medium ">Search Inventory</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-3">
                                <button className="btn btn-light w-100 d-flex flex-column align-items-center justify-content-center border shadow-sm p-3">
                                    <div className="bg-success bg-opacity-10 rounded-circle p-2 mb-2">
                                        <PlusCircle size={24} className="text-success" />
                                    </div>
                                    <span className="small fw-medium ">Add Item</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-3">
                                <button className="btn btn-light w-100 d-flex flex-column align-items-center justify-content-center border shadow-sm p-3">
                                    <div className="bg-purple-10 rounded-circle p-2 mb-2">
                                        <ClipboardList size={24} className="text-purple" />
                                    </div>
                                    <span className="small fw-medium ">Generate Report</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-3">
                                <button className="btn btn-light w-100 d-flex flex-column align-items-center justify-content-center border shadow-sm p-3">
                                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 mb-2">
                                        <RefreshCw size={24} className="text-warning" />
                                    </div>
                                    <span className="small fw-medium ">Update Stock</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Overview */}
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h5 ">Inventory Overview</h2>
                            <button className="btn btn-link p-0 text-primary d-flex align-items-center small fw-medium">
                                <TrendingUp size={16} className="me-1" />
                                View Analytics
                            </button>
                        </div>
                        <div className="row g-3">
                            {overviewCardData.map((item) => (
                                <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
                                    <OverviewCard
                                        Icon={item.Icon}
                                        color={item.color}
                                        title={item.title}
                                        itemType={item.itemType}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Dashboard;