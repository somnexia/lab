const researchTeamService = require('../services/researchTeamService');
const {
  skipLabScope,
  resolveActorLabId,
} = require('../utils/labScope');

/**
 * Фаза 5b: lab_admin / researcher / student — принудительно своя lab.
 * system_admin может передать ?labId=; без параметра — все labs.
 */
function resolveQueryLabId(req) {
  if (skipLabScope(req.user)) {
    return req.query.labId != null ? Number(req.query.labId) : undefined;
  }
  return resolveActorLabId(req.user);
}

const getGraph = async (req, res) => {
  try {
    const { groupBy, status } = req.query;
    const graph = await researchTeamService.getResearchTeamsGraph({
      groupBy,
      status,
      labId: resolveQueryLabId(req),
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
    const summary = await researchTeamService.getResearchTeamsSummary({
      status,
      labId: resolveQueryLabId(req),
    });
    return res.status(200).json(summary);
  } catch (error) {
    console.error('researchTeamController.getSummary:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getUnassigned = async (req, res) => {
  try {
    const employees = await researchTeamService.getUnassignedEmployees({
      labId: resolveQueryLabId(req),
    });
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
