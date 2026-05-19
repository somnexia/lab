const { Research, ResearchEmployee, Employee, Laboratory } = require('../models');
const { Op } = require('sequelize');

const NODE_PREFIX = {
  research: 'research',
  employee: 'employee',
  team: 'team',
};

function nodeId(type, id) {
  return `${NODE_PREFIX[type]}-${id}`;
}

function parseGroupBy(value) {
  const v = (value || 'department').toString().toLowerCase();
  if (['department', 'laboratory', 'none'].includes(v)) return v;
  return 'department';
}

function employeeDisplayName(employee) {
  if (!employee) return 'Unknown';
  const parts = [employee.name, employee.surname].filter(Boolean);
  return parts.join(' ').trim() || `Employee #${employee.id}`;
}

/**
 * Graph payload for research-teams visualization (D3, React Flow, Cytoscape, etc.)
 * @param {{ groupBy?: 'department'|'laboratory'|'none', status?: string, labId?: number }} options
 */
async function getResearchTeamsGraph(options = {}) {
  const groupBy = parseGroupBy(options.groupBy);
  const researchWhere = {};

  if (options.status) {
    researchWhere.status = options.status;
  }

  const employeeInclude = {
    model: Employee,
    as: 'employee',
    required: true,
    include: [{ model: Laboratory, as: 'laboratory', required: false }],
  };

  if (options.labId != null) {
    employeeInclude.where = { lab_id: Number(options.labId) };
  }

  const links = await ResearchEmployee.findAll({
    include: [
      {
        model: Research,
        as: 'research',
        required: true,
        where: Object.keys(researchWhere).length ? researchWhere : undefined,
      },
      employeeInclude,
    ],
  });

  const researchMap = new Map();
  const employeeMap = new Map();
  const teamMap = new Map();
  const edges = [];
  const edgeKeys = new Set();

  const addEdge = (source, target, payload) => {
    const key = `${source}|${target}|${payload.kind}|${payload.membershipId || ''}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ id: `edge-${edges.length + 1}`, source, target, ...payload });
  };

  for (const link of links) {
    const research = link.research;
    const employee = link.employee;
    if (!research || !employee) continue;

    const rId = nodeId('research', research.id);
    if (!researchMap.has(rId)) {
      researchMap.set(rId, {
        id: rId,
        type: 'research',
        entityId: research.id,
        label: research.title,
        status: research.status,
        researchType: research.type,
        startDate: research.start_date,
        endDate: research.end_date,
      });
    }

    const eId = nodeId('employee', employee.id);
    if (!employeeMap.has(eId)) {
      employeeMap.set(eId, {
        id: eId,
        type: 'employee',
        entityId: employee.id,
        label: employeeDisplayName(employee),
        position: employee.position,
        department: employee.department,
        specialization: employee.specialization,
        labId: employee.lab_id,
        laboratoryName: employee.laboratory?.lab_name || null,
      });
    }

    addEdge(eId, rId, {
      kind: 'membership',
      membershipId: link.id,
      role: link.role || null,
      directed: true,
    });

    if (groupBy === 'department' && employee.department) {
      const teamKey = `dept:${employee.department}`;
      const tId = nodeId('team', teamKey);
      if (!teamMap.has(tId)) {
        teamMap.set(tId, {
          id: tId,
          type: 'team',
          entityId: teamKey,
          label: employee.department,
          groupBy: 'department',
        });
      }
      addEdge(eId, tId, { kind: 'belongs_to_team', role: null, directed: true });
    }

    if (groupBy === 'laboratory' && employee.lab_id != null) {
      const teamKey = `lab:${employee.lab_id}`;
      const tId = nodeId('team', teamKey);
      if (!teamMap.has(tId)) {
        teamMap.set(tId, {
          id: tId,
          type: 'team',
          entityId: teamKey,
          label: employee.laboratory?.lab_name || `Lab #${employee.lab_id}`,
          groupBy: 'laboratory',
          labId: employee.lab_id,
        });
      }
      addEdge(eId, tId, { kind: 'belongs_to_team', role: null, directed: true });
    }
  }

  const nodes = [
    ...Array.from(researchMap.values()),
    ...Array.from(employeeMap.values()),
    ...Array.from(teamMap.values()),
  ];

  return {
    nodes,
    edges,
    meta: {
      groupBy,
      researchCount: researchMap.size,
      employeeCount: employeeMap.size,
      teamCount: teamMap.size,
      linkCount: edges.filter((e) => e.kind === 'membership').length,
      generatedAt: new Date().toISOString(),
    },
  };
}

/** List researches with participant counts (table / sidebar on research-teams page) */
async function getResearchTeamsSummary(options = {}) {
  const where = {};
  if (options.status) where.status = options.status;

  const researches = await Research.findAll({
    where: Object.keys(where).length ? where : undefined,
    include: [
      {
        model: ResearchEmployee,
        as: 'participants',
        required: false,
        include: [
          {
            model: Employee,
            as: 'employee',
            required: false,
            include: [{ model: Laboratory, as: 'laboratory', required: false }],
          },
        ],
      },
    ],
    order: [['start_date', 'DESC']],
  });

  return researches.map((r) => {
    const plain = r.get({ plain: true });
    const participants = plain.participants || [];
    return {
      id: plain.id,
      title: plain.title,
      status: plain.status,
      type: plain.type,
      startDate: plain.start_date,
      endDate: plain.end_date,
      participantCount: participants.length,
      participants: participants.map((p) => ({
        membershipId: p.id,
        role: p.role,
        employee: p.employee
          ? {
              id: p.employee.id,
              name: employeeDisplayName(p.employee),
              department: p.employee.department,
              position: p.employee.position,
              laboratoryName: p.employee.laboratory?.lab_name || null,
            }
          : null,
      })),
    };
  });
}

/** Employees with no research assignment (orphans for UI warnings) */
async function getUnassignedEmployees() {
  const assignedIds = await ResearchEmployee.findAll({
    attributes: ['employee_id'],
    where: { employee_id: { [Op.ne]: null } },
    raw: true,
  });
  const ids = [...new Set(assignedIds.map((r) => r.employee_id).filter(Boolean))];

  return Employee.findAll({
    where: ids.length ? { id: { [Op.notIn]: ids } } : {},
    include: [{ model: Laboratory, as: 'laboratory', required: false }],
    order: [['surname', 'ASC'], ['name', 'ASC']],
  });
}

module.exports = {
  getResearchTeamsGraph,
  getResearchTeamsSummary,
  getUnassignedEmployees,
};
