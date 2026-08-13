import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE, API_REAGENTS } from '../config/api';

class OverviewCard extends Component {
  state = {
    count: null,
    meta: null,
    loading: true,
    error: null,
  };

  async componentDidMount() {
    await this.fetchCount();
  }

  fetchCount = async () => {
    const { itemType } = this.props;

    try {
      if (itemType === 'chemicals') {
        const response = await axios.get(`${API_REAGENTS}/summary`);
        const { catalogTotal, lotCount, inStockCount } = response.data;
        this.setState({
          count: catalogTotal,
          meta: `${lotCount} lots · ${inStockCount} in stock`,
          loading: false,
        });
        return;
      }

      let endpoint = '';
      switch (itemType) {
        case 'equipment':
          endpoint = `${API_BASE}/inventories/equipment/count`;
          break;
        case 'researches':
          endpoint = `${API_BASE}/researches/ongoing/count`;
          break;
        case 'orders':
          endpoint = `${API_BASE}/orders/active/count`;
          break;
        default:
          this.setState({ loading: false, error: 'Unknown card type' });
          return;
      }

      const response = await axios.get(endpoint);
      this.setState({
        count: response.data.count,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load overview card:', error);
      this.setState({ loading: false, error: '—' });
    }
  };

  renderCount = () => {
    const { count, meta, loading, error } = this.state;

    if (loading) {
      return 'Loading…';
    }

    if (error) {
      return error;
    }

    return (
      <>
        {count}
        {meta && <span className="overview-card__meta">{meta}</span>}
      </>
    );
  };

  render() {
    const { Icon, variant = 'accent', title, linkTo, linkLabel = 'View all' } = this.props;

    return (
      <div className="overview-card">
        <div className="overview-card__body">
          <div className="d-flex align-items-center">
            <div className={`overview-card__icon overview-card__icon--${variant}`}>
              <Icon size={24} />
            </div>
            <div className="ms-3 flex-grow-1">
              <dl className="mb-0">
                <dt className="overview-card__label">{title}</dt>
                <dd className="overview-card__value">{this.renderCount()}</dd>
              </dl>
            </div>
          </div>
        </div>
        {linkTo && (
          <div className="overview-card__footer">
            <Link to={linkTo} className="overview-card__link">
              {linkLabel}
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default OverviewCard;
