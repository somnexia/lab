export const REAGENT_ITEM_TYPES = ['element', 'compound', 'mixture'];

export const getCatalogFromLot = (lot) => (
  lot?.chemCompound
  || lot?.chemElement
  || lot?.chemMixture
  || lot?.chemEquipment
  || null
);

export const enrichInventoryLot = (lot) => {
  const catalog = getCatalogFromLot(lot);

  return {
    ...lot,
    catalogName: catalog?.name || lot.item_name || 'Unnamed lot',
    catalogCas: catalog?.cas_id || null,
    catalogFormula: lot.chemCompound?.formula || lot.chemElement?.symbol || null,
  };
};

export const enrichInventoryLots = (lots = []) => lots.map(enrichInventoryLot);

export const getStockFilterParams = (stockFilter) => {
  if (stockFilter === 'reagents') {
    return { item_types: REAGENT_ITEM_TYPES.join(',') };
  }

  if (stockFilter === 'equipment') {
    return { item_type: 'equipment' };
  }

  return {};
};
