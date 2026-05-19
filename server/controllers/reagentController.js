const reagentService = require('../services/reagentService');

const listReagents = async (req, res) => {
  try {
    const { types, q, inStock } = req.query;
    const items = await reagentService.listReagents({ types, q, inStock });
    return res.status(200).json(items);
  } catch (error) {
    console.error('listReagents:', error);
    return res.status(500).json({ error: 'Failed to load reagent catalog' });
  }
};

const getReagent = async (req, res) => {
  try {
    const { kind, id } = req.params;
    const item = await reagentService.getReagentByKindAndId(kind, Number(id));

    if (!item) {
      return res.status(404).json({ error: 'Reagent not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error('getReagent:', error);
    return res.status(500).json({ error: 'Failed to load reagent details' });
  }
};

const getReagentSummary = async (req, res) => {
  try {
    const summary = await reagentService.getReagentSummary();
    return res.status(200).json(summary);
  } catch (error) {
    console.error('getReagentSummary:', error);
    return res.status(500).json({ error: 'Failed to load reagent summary' });
  }
};

module.exports = {
  listReagents,
  getReagent,
  getReagentSummary,
};
