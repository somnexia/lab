import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import OverviewCard from './OverviewCard';
import { FaFlask } from 'react-icons/fa';
import { FaMicroscope } from 'react-icons/fa6';
import { GiArchiveResearch } from 'react-icons/gi';
import { FaCartArrowDown } from 'react-icons/fa';
import {
  ClipboardList,
  PlusCircle,
  RefreshCw,
  Search,
  TrendingUp,
} from 'lucide-react';

class Dashboard extends Component {
  render() {
    const overviewCardData = [
      {
        id: 1,
        Icon: FaFlask,
        variant: 'info',
        title: 'Chemicals',
        itemType: 'chemicals',
        linkTo: '/inventory/chemicals',
        linkLabel: 'Open catalog',
      },
      {
        id: 2,
        Icon: FaMicroscope,
        variant: 'success',
        title: 'Equipment',
        itemType: 'equipment',
        linkTo: '/lab-equipment',
        linkLabel: 'View equipment',
      },
      {
        id: 3,
        Icon: GiArchiveResearch,
        variant: 'accent',
        title: 'Ongoing researches',
        itemType: 'researches',
        linkTo: '/projects/research-list',
        linkLabel: 'Open projects',
      },
      {
        id: 4,
        Icon: FaCartArrowDown,
        variant: 'warning',
        title: 'Active orders',
        itemType: 'orders',
        linkTo: '/customer/cart',
        linkLabel: 'Open cart',
      },
    ];

    const quickActions = [
      {
        id: 'catalog',
        Icon: Search,
        variant: 'primary',
        title: 'Browse reagents',
        to: '/inventory/chemicals',
      },
      {
        id: 'stock',
        Icon: RefreshCw,
        variant: 'warning',
        title: 'Stock overview',
        to: '/inventory/overview',
      },
      {
        id: 'research',
        Icon: ClipboardList,
        variant: 'accent',
        title: 'Research list',
        to: '/projects/research-list',
      },
      {
        id: 'register',
        Icon: PlusCircle,
        variant: 'success',
        title: 'Register lot',
        to: '/inventory/lots/register',
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
              Welcome back! Here&apos;s an overview of your laboratory inventory.
            </p>
          </section>

          <section className="lab-dashboard__section">
            <h2 className="lab-dashboard__section-title mb-3">Quick actions</h2>
            <div className="row g-3">
              {quickActions.map(({ id, Icon, variant, title, to }) => (
                <div className="col-6 col-md-3" key={id}>
                  <Link
                    className={`lab-dashboard__quick-action lab-dashboard__quick-action--${variant}`}
                    to={to}
                  >
                    <span className="lab-dashboard__quick-action-icon">
                      <Icon size={24} />
                    </span>
                    <span className="small fw-semibold">{title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="lab-dashboard__section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="lab-dashboard__section-title">Inventory overview</h2>
              <Link className="btn btn-link p-0 lab-dashboard__analytics-link" to="/inventory/lots">
                <TrendingUp size={16} />
                View all lots
              </Link>
            </div>
            <div className="row g-3">
              {overviewCardData.map((item) => (
                <div className="col-12 col-sm-6 col-lg-3" key={item.id}>
                  <OverviewCard
                    Icon={item.Icon}
                    variant={item.variant}
                    title={item.title}
                    itemType={item.itemType}
                    linkTo={item.linkTo}
                    linkLabel={item.linkLabel}
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
