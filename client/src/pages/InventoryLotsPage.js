import React from 'react';
import { Link } from 'react-router-dom';
import InventoryStockOverview from '../components/InventoryStockOverview';
import Can from '../components/Can';
import { getInventoryMaterialsMeta } from './inventorySections';

function InventoryLotsPage() {
  const meta = getInventoryMaterialsMeta('/inventory/lots');

  return (
    <div className="inventory-lots-page">
      <InventoryStockOverview
        fullPage
        variant="lots"
        sectionTitle={meta?.title || 'Lots & batches'}
        sectionDescription={meta?.hint}
        headerAction={(
          <Can perm="showRegisterLot">
            <Link to="/inventory/lots/register" className="inventory-lots-page__register-btn">
              Register lot
            </Link>
          </Can>
        )}
      />
    </div>
  );
}

export default InventoryLotsPage;
