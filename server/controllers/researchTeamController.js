const researchTeamService = require('../services/researchTeamService');

const getGraph = async (req, res) => {
  try {
    const { groupBy, status, labId } = req.query;
    const graph = await researchTeamService.getResearchTeamsGraph({
      groupBy,
      status,
      labId: labId != null ? Number(labId) : undefined,
    });
    return res.status(200).json(graph);
  } catch (error) {
    console.error('researchTeamController.getGraph:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const { status } = req.query;
    const summary = await researchTeamService.getResearchTeamsSummary({ status });
    return res.status(200).json(summary);
  } catch (error) {
    console.error('researchTeamController.getSummary:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getUnassigned = async (req, res) => {
  try {
    const employees = await researchTeamService.getUnassignedEmployees();
    return res.status(200).json(employees);
  } catch (error) {
    console.error('researchTeamController.getUnassigned:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGraph,
  getSummary,
  getUnassigned,
};
