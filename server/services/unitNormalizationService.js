'use strict';

class UnitConversionError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'UnitConversionError';
    this.details = details;
  }
}

const MASS_TO_GRAMS = Object.freeze({
  g: 1,
  mg: 0.001,
  kg: 1000,
});

const VOLUME_TO_LITERS = Object.freeze({
  l: 1,
  ml: 0.001,
});

const normalizeUnit = (unit) => String(unit || '').trim().toLowerCase();

const getUnitFamily = (unit) => {
  const normalized = normalizeUnit(unit);
  if (normalized in MASS_TO_GRAMS) return 'mass';
  if (normalized in VOLUME_TO_LITERS) return 'volume';
  return null;
};

const toBaseQuantity = (quantity, unit) => {
  const normalized = normalizeUnit(unit);
  const numeric = Number(quantity);

  if (!Number.isFinite(numeric)) {
    throw new UnitConversionError(`Invalid quantity: ${quantity}`);
  }

  if (normalized in MASS_TO_GRAMS) {
    return {
      family: 'mass',
      baseQuantity: numeric * MASS_TO_GRAMS[normalized],
      baseUnit: 'g',
    };
  }

  if (normalized in VOLUME_TO_LITERS) {
    return {
      family: 'volume',
      baseQuantity: numeric * VOLUME_TO_LITERS[normalized],
      baseUnit: 'L',
    };
  }

  return {
    family: null,
    baseQuantity: numeric,
    baseUnit: normalized || null,
  };
};

const fromBaseQuantity = (baseQuantity, targetUnit) => {
  const normalized = normalizeUnit(targetUnit);

  if (normalized in MASS_TO_GRAMS) {
    return baseQuantity / MASS_TO_GRAMS[normalized];
  }

  if (normalized in VOLUME_TO_LITERS) {
    return baseQuantity / VOLUME_TO_LITERS[normalized];
  }

  return baseQuantity;
};

const convertQuantity = (quantity, fromUnit, toUnit) => {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (!from || !to || from === to) {
    return Number(quantity);
  }

  const fromFamily = getUnitFamily(from);
  const toFamily = getUnitFamily(to);

  if (!fromFamily || !toFamily) {
    return Number(quantity);
  }

  if (fromFamily !== toFamily) {
    throw new UnitConversionError(`Cannot convert ${fromUnit} to ${toUnit}`, {
      fromUnit,
      toUnit,
    });
  }

  const { baseQuantity } = toBaseQuantity(quantity, fromUnit);
  return fromBaseQuantity(baseQuantity, toUnit);
};

const formatQuantity = (quantity, unit) => {
  const numeric = Number(quantity);
  const rounded = Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(3).replace(/\.?0+$/, '');
  return unit ? `${rounded} ${unit}` : rounded;
};

module.exports = {
  UnitConversionError,
  normalizeUnit,
  getUnitFamily,
  convertQuantity,
  formatQuantity,
};
