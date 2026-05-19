const { Op } = require('sequelize');
const {
  ChemElement,
  ChemCompound,
  ChemMixture,
  Inventory,
  StorageUnit,
} = require('../models');

const REAGENT_KINDS = ['element', 'compound', 'mixture'];

const emptyStock = () => ({
  lotCount: 0,
  totalOnHand: 0,
  unit: null,
  inStock: false,
  nearestExpiry: null,
});

const buildStockAggregatesMap = async () => {
  const lots = await Inventory.findAll({
    where: { item_type: { [Op.in]: REAGENT_KINDS } },
    attributes: [
      'reference_id',
      'item_type',
      'total_quantity',
      'substance_amount',
      'unit_measure',
      'expiration_date',
    ],
  });

  const map = new Map();

  for (const lot of lots) {
    const key = `${lot.item_type}:${lot.reference_id}`;
    if (!map.has(key)) {
      map.set(key, emptyStock());
    }

    const agg = map.get(key);
    agg.lotCount += 1;
    agg.totalOnHand += Number(lot.total_quantity ?? lot.substance_amount ?? 0);
    if (!agg.unit && lot.unit_measure) {
      agg.unit = lot.unit_measure;
    }
    if (lot.expiration_date) {
      const expiry = new Date(lot.expiration_date);
      if (!agg.nearestExpiry || expiry < new Date(agg.nearestExpiry)) {
        agg.nearestExpiry = lot.expiration_date;
      }
    }
    agg.inStock = true;
  }

  return map;
};

const getStockFor = (map, kind, catalogId) => {
  return map.get(`${kind}:${catalogId}`) || emptyStock();
};

const mapElement = (row, stock) => ({
  kind: 'element',
  catalogId: row.id,
  name: row.name,
  symbol: row.symbol,
  casId: row.cas_id,
  formula: row.symbol,
  detail: `Atomic number ${row.atomic_number}`,
  aggregateState: row.aggregate_state,
  description: row.description,
  stock,
});

const mapCompound = (row, stock) => ({
  kind: 'compound',
  catalogId: row.id,
  name: row.name,
  casId: row.cas_id,
  formula: row.formula,
  detail: row.molecular_weight ? `MW ${row.molecular_weight}` : null,
  aggregateState: row.aggregate_state,
  description: row.description,
  stock,
});

const mapMixture = (row, stock) => ({
  kind: 'mixture',
  catalogId: row.id,
  name: row.name,
  casId: row.cas_id,
  formula: null,
  composition: row.composition,
  mixtureType: row.mixture_type,
  detail: row.mixture_type || 'Mixture',
  aggregateState: row.aggregate_state,
  description: row.description,
  stock,
});

const listReagents = async ({ types, q, inStock } = {}) => {
  const kinds = types
    ? types.split(',').map((value) => value.trim()).filter((value) => REAGENT_KINDS.includes(value))
    : REAGENT_KINDS;

  const stockMap = await buildStockAggregatesMap();
  let items = [];

  if (kinds.includes('element')) {
    const rows = await ChemElement.findAll({ order: [['name', 'ASC']] });
    items = items.concat(
      rows.map((row) => mapElement(row, getStockFor(stockMap, 'element', row.id)))
    );
  }

  if (kinds.includes('compound')) {
    const rows = await ChemCompound.findAll({ order: [['name', 'ASC']] });
    items = items.concat(
      rows.map((row) => mapCompound(row, getStockFor(stockMap, 'compound', row.id)))
    );
  }

  if (kinds.includes('mixture')) {
    const rows = await ChemMixture.findAll({ order: [['name', 'ASC']] });
    items = items.concat(
      rows.map((row) => mapMixture(row, getStockFor(stockMap, 'mixture', row.id)))
    );
  }

  if (q) {
    const needle = q.trim().toLowerCase();
    items = items.filter((item) => {
      return (
        item.name?.toLowerCase().includes(needle)
        || item.casId?.toLowerCase().includes(needle)
        || item.formula?.toLowerCase().includes(needle)
        || item.composition?.toLowerCase().includes(needle)
      );
    });
  }

  if (inStock === 'true') {
    items = items.filter((item) => item.stock.inStock);
  } else if (inStock === 'false') {
    items = items.filter((item) => !item.stock.inStock);
  }

  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  return items;
};

const getCatalogModel = (kind) => {
  const models = {
    element: ChemElement,
    compound: ChemCompound,
    mixture: ChemMixture,
  };
  return models[kind] || null;
};

const getReagentByKindAndId = async (kind, id) => {
  if (!REAGENT_KINDS.includes(kind)) {
    throw new Error(`Unsupported reagent kind: ${kind}`);
  }

  const Model = getCatalogModel(kind);
  const catalog = await Model.findByPk(id);

  if (!catalog) {
    return null;
  }

  const stockMap = await buildStockAggregatesMap();
  const stock = getStockFor(stockMap, kind, id);

  const catalogMappers = {
    element: mapElement,
    compound: mapCompound,
    mixture: mapMixture,
  };

  const lots = await Inventory.findAll({
    where: { reference_id: id, item_type: kind },
    include: [{ model: StorageUnit, as: 'storageUnits', required: false }],
    order: [['expiration_date', 'ASC'], ['id', 'ASC']],
  });

  return {
    ...catalogMappers[kind](catalog, stock),
    lots,
  };
};

const getReagentSummary = async () => {
  const stockMap = await buildStockAggregatesMap();
  const [elementCount, compoundCount, mixtureCount] = await Promise.all([
    ChemElement.count(),
    ChemCompound.count(),
    ChemMixture.count(),
  ]);

  let inStockCount = 0;
  let outOfStockCount = 0;

  for (const kind of REAGENT_KINDS) {
    const Model = getCatalogModel(kind);
    const rows = await Model.findAll({ attributes: ['id'] });
    for (const row of rows) {
      if (getStockFor(stockMap, kind, row.id).inStock) {
        inStockCount += 1;
      } else {
        outOfStockCount += 1;
      }
    }
  }

  const lotCount = [...stockMap.values()].reduce((sum, stock) => sum + stock.lotCount, 0);

  return {
    catalogTotal: elementCount + compoundCount + mixtureCount,
    byKind: {
      element: elementCount,
      compound: compoundCount,
      mixture: mixtureCount,
    },
    inStockCount,
    outOfStockCount,
    lotCount,
  };
};

module.exports = {
  REAGENT_KINDS,
  listReagents,
  getReagentByKindAndId,
  getReagentSummary,
};
