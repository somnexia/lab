const CatalogReferenceError = require('../errors/CatalogReferenceError');
const MixtureCompositionError = require('../errors/MixtureCompositionError');

const sendMixtureError = (error, res) => {
  if (error instanceof MixtureCompositionError) {
    return res.status(error.statusCode || 400).json({
      error: error.message,
      details: error.details,
    });
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

module.exports = { sendMixtureError };
