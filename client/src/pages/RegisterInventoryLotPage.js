import React, { Component } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import InventoryLotForm from '../components/InventoryLotForm';

class RegisterInventoryLotPage extends Component {
  state = {
    successLotId: null,
  };

  handleSuccess = (lot) => {
    this.setState({ successLotId: lot.id });
  };

  render() {
    const { successLotId } = this.state;
    const { initialValues, navigate } = this.props;

    return (
      <div className="inventory-lot-register inventory-page">
        <header className="inventory-page__hero inventory-lot-register__hero">
          <div>
            <p className="inventory-page__eyebrow">Materials inventory</p>
            <h1 className="inventory-page__title">Register stock lot</h1>
            <p className="inventory-page__subtitle">
              Create a warehouse lot linked to a catalog entry. Quantities, expiry, and storage location are tracked per lot.
            </p>
          </div>
          <Link to="/inventory/lots" className="inventory-lot-register__back">
            Back to lots
          </Link>
        </header>

        {successLotId ? (
          <div className="inventory-lot-register__success" role="status">
            <h2>Lot #{successLotId} registered</h2>
            <p>The new batch is now available in stock lots and linked to the catalog.</p>
            <div className="inventory-lot-register__success-actions">
              <button
                type="button"
                className="inventory-lot-register__btn inventory-lot-register__btn--primary"
                onClick={() => navigate('/inventory/lots')}
              >
                View all lots
              </button>
              <button
                type="button"
                className="inventory-lot-register__btn"
                onClick={() => this.setState({ successLotId: null })}
              >
                Register another
              </button>
            </div>
          </div>
        ) : (
          <section className="inventory-page__content">
            <InventoryLotForm initialValues={initialValues} onSuccess={this.handleSuccess} />
          </section>
        )}
      </div>
    );
  }
}

function RegisterInventoryLotPageRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialValues = {
    item_type: searchParams.get('item_type') || '',
    reference_id: searchParams.get('reference_id') || '',
    item_name: searchParams.get('name') || '',
  };

  return <RegisterInventoryLotPage initialValues={initialValues} navigate={navigate} />;
}

export default RegisterInventoryLotPageRoute;
