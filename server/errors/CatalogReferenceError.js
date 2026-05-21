class CatalogReferenceError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'CatalogReferenceError';
    this.statusCode = 400;
    this.details = details;
  }
}

module.exports = CatalogReferenceError;
