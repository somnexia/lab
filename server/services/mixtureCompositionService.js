const { sequelize } = require('../models');
const { ChemMixture, MixtureComponent } = require('../models');
const MixtureCompositionError = require('../errors/MixtureCompositionError');
const CatalogReferenceError = require('../errors/CatalogReferenceError');
const {
  assertCatalogReference,
  isReagentItemType,
  resolveCatalogDisplayName,
} = require('./catalogReferenceService');

const MOLE_FRACTION_TOLERANCE = 0.001;
const COMPONENT_ROLES = ['', 'solvent', 'solute', 'catalyst', 'buffer', 'other'];

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapComponentRow = (row, catalog = null) => ({
  id: row.id,
  mixtureId: row.mixture_id,
  componentKind: row.component_kind,
  componentId: row.component_id,
  role: row.role || '',
  amount: row.amount != null ? Number(row.amount) : null,
  amountUnit: row.amount_unit,
  moleFraction: row.mole_fraction != null ? Number(row.mole_fraction) : null,
  sortOrder: row.sort_order,
  notes: row.notes,
  catalogName: catalog ? resolveCatalogDisplayName(row.component_kind, catalog) : null,
  catalogCas: catalog?.cas_id || null,
  catalogFormula: catalog?.formula || catalog?.symbol || null,
});

const loadCatalogForComponent = async (componentKind, componentId) => {
  return assertCatalogReference(componentKind, componentId);
};

const enrichComponents = async (rows) => {
  return Promise.all(
    rows.map(async (row) => {
      const catalog = await loadCatalogForComponent(row.component_kind, row.component_id);
      return mapComponentRow(row, catalog);
    })
  );
};

const assertAmountOrFractionRules = (component, index) => {
  const amount = toNumberOrNull(component.amount);
  const moleFraction = toNumberOrNull(component.moleFraction ?? component.mole_fraction);
  const hasAmount = amount != null;
  const hasFraction = moleFraction != null;

  if (hasAmount && hasFraction) {
    throw new MixtureCompositionError(
      `Component at index ${index}: specify either amount or mole_fraction, not both`,
      { index }
    );
  }

  if (hasFraction && (moleFraction < 0 || moleFraction > 1)) {
    throw new MixtureCompositionError(
      `Component at index ${index}: mole_fraction must be between 0 and 1`,
      { index, mole_fraction: moleFraction }
    );
  }

  if (hasAmount && amount < 0) {
    throw new MixtureCompositionError(
      `Component at index ${index}: amount must be non-negative`,
      { index }
    );
  }

  if (hasAmount && !component.amountUnit && !component.amount_unit) {
    throw new MixtureCompositionError(
      `Component at index ${index}: amount_unit is required when amount is set`,
      { index }
    );
  }
};

const assertMoleFractionSum = (components) => {
  const fractions = components
    .map((c) => toNumberOrNull(c.moleFraction ?? c.mole_fraction))
    .filter((value) => value != null);

  if (!fractions.length) {
    return;
  }

  const sum = fractions.reduce((acc, value) => acc + value, 0);
  if (Math.abs(sum - 1) > MOLE_FRACTION_TOLERANCE) {
    throw new MixtureCompositionError(
      `Sum of mole_fraction values must be 1 (±${MOLE_FRACTION_TOLERANCE}), got ${sum.toFixed(6)}`,
      { sum, expected: 1, tolerance: MOLE_FRACTION_TOLERANCE }
    );
  }
};

const assertNoMixtureCycle = async (mixtureId, componentKind, componentId, visiting = new Set()) => {
  if (componentKind !== 'mixture') {
    return;
  }

  const parentId = Number(mixtureId);
  const childMixtureId = Number(componentId);

  if (childMixtureId === parentId) {
    throw new MixtureCompositionError('A mixture cannot include itself as a component', {
      mixture_id: parentId,
    });
  }

  const visitKey = `${componentKind}:${childMixtureId}`;
  if (visiting.has(visitKey)) {
    return;
  }

  visiting.add(visitKey);

  const nested = await MixtureComponent.findAll({
    where: { mixture_id: childMixtureId },
    attributes: ['component_kind', 'component_id'],
  });

  for (const row of nested) {
    await assertNoMixtureCycle(
      parentId,
      row.component_kind,
      row.component_id,
      visiting
    );
  }
};

const normalizeIncomingComponent = (raw, index) => {
  const componentKind = raw.componentKind || raw.component_kind;
  const componentId = raw.componentId ?? raw.component_id;

  if (!isReagentItemType(componentKind)) {
    throw new MixtureCompositionError(
      `Component at index ${index}: invalid component_kind "${componentKind}"`,
      { index, allowed: ['element', 'compound', 'mixture'] }
    );
  }

  const role = (raw.role || '').trim();
  if (role && !COMPONENT_ROLES.includes(role) && role.length > 50) {
    throw new MixtureCompositionError(`Component at index ${index}: role is too long`, { index });
  }

  const payload = {
    component_kind: componentKind,
    component_id: Number(componentId),
    role,
    amount: toNumberOrNull(raw.amount),
    amount_unit: raw.amountUnit || raw.amount_unit || null,
    mole_fraction: toNumberOrNull(raw.moleFraction ?? raw.mole_fraction),
    sort_order: raw.sortOrder ?? raw.sort_order ?? index,
    notes: raw.notes || null,
  };

  assertAmountOrFractionRules(
    {
      amount: payload.amount,
      amountUnit: payload.amount_unit,
      moleFraction: payload.mole_fraction,
    },
    index
  );

  return payload;
};

const buildCompositionSummary = (components) => {
  if (!components.length) {
    return '';
  }

  return components
    .map((component) => {
      const name = component.catalogName || `${component.componentKind} #${component.componentId}`;
      const roleSuffix = component.role ? ` (${component.role})` : '';

      if (component.moleFraction != null) {
        return `${name}${roleSuffix}: ${(component.moleFraction * 100).toFixed(2)}% mol`;
      }

      if (component.amount != null) {
        const unit = component.amountUnit ? ` ${component.amountUnit}` : '';
        return `${name}${roleSuffix}: ${component.amount}${unit}`;
      }

      return `${name}${roleSuffix}`;
    })
    .join('; ');
};

const getMixtureOrThrow = async (mixtureId) => {
  const mixture = await ChemMixture.findByPk(mixtureId);
  if (!mixture) {
    const error = new MixtureCompositionError(`Mixture with id ${mixtureId} not found`, {
      mixtureId,
    });
    error.statusCode = 404;
    throw error;
  }
  return mixture;
};

const getMixtureComponents = async (mixtureId) => {
  await getMixtureOrThrow(mixtureId);

  const rows = await MixtureComponent.findAll({
    where: { mixture_id: mixtureId },
    order: [
      ['sort_order', 'ASC'],
      ['id', 'ASC'],
    ],
  });

  return enrichComponents(rows);
};

const replaceMixtureComponents = async (mixtureId, incoming = [], options = {}) => {
  const { syncCompositionText = true } = options;
  const mixture = await getMixtureOrThrow(mixtureId);

  if (!Array.isArray(incoming)) {
    throw new MixtureCompositionError('components must be an array');
  }

  const normalized = incoming.map((row, index) => normalizeIncomingComponent(row, index));

  const uniqueKeys = new Set();
  for (const row of normalized) {
    const key = `${row.component_kind}:${row.component_id}:${row.role}`;
    if (uniqueKeys.has(key)) {
      throw new MixtureCompositionError('Duplicate component in composition', { key });
    }
    uniqueKeys.add(key);
  }

  assertMoleFractionSum(normalized);

  for (const row of normalized) {
    await assertCatalogReference(row.component_kind, row.component_id);
    await assertNoMixtureCycle(mixtureId, row.component_kind, row.component_id);
  }

  const transaction = await sequelize.transaction();

  try {
    await MixtureComponent.destroy({
      where: { mixture_id: mixtureId },
      transaction,
    });

    if (normalized.length) {
      await MixtureComponent.bulkCreate(
        normalized.map((row) => ({
          ...row,
          mixture_id: mixtureId,
        })),
        { transaction }
      );
    }

    const enriched = await MixtureComponent.findAll({
      where: { mixture_id: mixtureId },
      order: [
        ['sort_order', 'ASC'],
        ['id', 'ASC'],
      ],
      transaction,
    });

    let compositionSummary = mixture.composition;

    if (syncCompositionText) {
      const enrichedDtos = await enrichComponents(enriched);
      compositionSummary = buildCompositionSummary(enrichedDtos) || mixture.composition;
      await mixture.update({ composition: compositionSummary }, { transaction });
    }

    await transaction.commit();

    const components = await enrichComponents(enriched);

    return {
      mixtureId: Number(mixtureId),
      components,
      compositionSummary,
      moleFractionSum: components
        .filter((c) => c.moleFraction != null)
        .reduce((sum, c) => sum + c.moleFraction, 0),
    };
  } catch (error) {
    await transaction.rollback();
    if (error instanceof MixtureCompositionError || error instanceof CatalogReferenceError) {
      throw error;
    }
    throw error;
  }
};

module.exports = {
  COMPONENT_ROLES,
  MOLE_FRACTION_TOLERANCE,
  getMixtureComponents,
  replaceMixtureComponents,
  buildCompositionSummary,
  enrichComponents,
};
