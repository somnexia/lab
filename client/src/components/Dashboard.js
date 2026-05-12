import React, { Component } from 'react';
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
                variant: 'info',
                title: 'Chemicals',
                itemType: 'chemicals',
            },
            {
                id: 2,
                Icon: FaMicroscope,
                variant: 'success',
                title: 'Equipment',
                itemType: 'equipment',
            },
            {
                id: 3,
                Icon: GiArchiveResearch ,
                variant: 'accent',
                title: 'Ongoing Researches',
                itemType: 'researches',
            },
            {
                id: 4,
                Icon: FaCartArrowDown ,
                variant: 'warning',
                title: 'Active Orders',
                itemType: 'orders',
            },
        ];

        const quickActions = [
            {
                id: 'search',
                Icon: Search,
                variant: 'primary',
                title: 'Search Inventory',
            },
            {
                id: 'add',
                Icon: PlusCircle,
                variant: 'success',
                title: 'Add Item',
            },
            {
                id: 'report',
                Icon: ClipboardList,
                variant: 'accent',
                title: 'Generate Report',
            },
            {
                id: 'stock',
                Icon: RefreshCw,
                variant: 'warning',
                title: 'Update Stock',
            },
        ];


        return (
            <div className="lab-dashboard flex-grow">
                <div className="container-xl lab-dashboard__container">
                    <section className="lab-dashboard__hero">
                        <p className="lab-dashboard__eyebrow">Inventory management</p>
                        <h1 className="lab-dashboard__title">
                            Laboratory Inventory Dashboard
                        </h1>
                        <p className="lab-dashboard__subtitle">
                            Welcome back! Here's an overview of your laboratory inventory.
                        </p>
                    </section>

                    <section className="lab-dashboard__section">
                        <h2 className="lab-dashboard__section-title mb-3">Quick Actions</h2>
                        <div className="row g-3">
                            {quickActions.map(({ id, Icon, variant, title }) => (
                            <div className="col-6 col-md-3" key={id}>
                                <button
                                    className={`lab-dashboard__quick-action lab-dashboard__quick-action--${variant}`}
                                    type="button"
                                >
                                    <span className="lab-dashboard__quick-action-icon">
                                        <Icon size={24} />
                                    </span>
                                    <span className="small fw-semibold">{title}</span>
                                </button>
                            </div>
                            ))}
                        </div>
                    </section>

                    <section className="lab-dashboard__section">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="lab-dashboard__section-title">Inventory Overview</h2>
                            <button className="btn btn-link p-0 lab-dashboard__analytics-link" type="button">
                                <TrendingUp size={16} />
                                View Analytics
                            </button>
                        </div>
                        <div className="row g-3">
                            {overviewCardData.map((item) => (
                                <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
                                    <OverviewCard
                                        Icon={item.Icon}
                                        variant={item.variant}
                                        title={item.title}
                                        itemType={item.itemType}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

        );
    }
}

export default Dashboard;