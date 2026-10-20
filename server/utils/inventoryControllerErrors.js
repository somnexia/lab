const CatalogReferenceError = require('../errors/CatalogReferenceError');
const { isScopeForbidden } = require('./labScope');

const sendInventoryError = (error, res) => {
  if (isScopeForbidden(error)) {
    return res.status(403).json({ error: error.message, code: error.code });
  }

  if (error instanceof CatalogReferenceError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
  }

  if (error.message?.includes('не найдена') || error.message?.includes('not found')) {
    return res.status(404).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: error.message || 'Internal server error' });
};

module.exports = { sendInventoryError };
