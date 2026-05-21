class MixtureCompositionError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'MixtureCompositionError';
    this.statusCode = 400;
    this.details = details;
  }
}

module.exports = MixtureCompositionError;
