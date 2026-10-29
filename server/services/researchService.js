const { Op } = require('sequelize');
const { Research, ResearchEmployee, Employee } = require('../models');
const {
  scopeResearchesWhere,
  assertCanViewResearch,
  assertCanEditResearch,
  ensureActorMembership,
  assertEmployeesInActorLab,
  researchBelongsToActorScope,
} = require('../utils/researchScope');
const {
  skipLabScope,
  enforceLabOnCreate,
  resolveActorLabId,
} = require('../utils/labScope');
const { isLabAdmin } = require('../config/roles');
const {
  isUniqueMembershipError,
} = require('./researchEmployeeService');

const participantInclude = {
  model: ResearchEmployee,
  as: 'participants',
  include: [
    {
      model: Employee,
      as: 'employee',
      include: [{ association: 'laboratory', required: false }],
    },
  ],
};

/**
 * Create payload: laboratory_id только из lab актора
 * (system_admin может явно указать laboratory_id в body).
 */
function prepareResearchCreatePayload(user, data = {}) {
  const laboratory_id = enforceLabOnCreate(
    user,
    data.laboratory_id ?? data.laboratoryId
  );
  return {
    ...data,
    laboratory_id,
  };
}

/**
 * Update payload для laboratory_id:
 * - system_admin — любой номер (или null) из body;
 * - lab_admin — только если сейчас null, и только свою lab
 *   (чужой номер в body → 403; researcher не трогает поле).
 * Не auto-heal: поле пишется только если его передали в body.
 */
function prepareResearchUpdatePayload(user, research, data = {}) {
  const payload = { ...data };
  delete payload.laboratoryId;

  const labInBody =
    data.laboratory_id !== undefined || data.laboratoryId !== undefined;
  const raw = labInBody ? data.laboratory_id ?? data.laboratoryId : undefined;

  if (skipLabScope(user)) {
    if (labInBody) {
      payload.laboratory_id = raw == null || raw === '' ? null : Number(raw);
    }
    return payload;
  }

  if (isLabAdmin(user) && labInBody && research?.laboratory_id == null) {
    const actorLab = resolveActorLabId(user);
    if (actorLab == null) {
      const err = new Error('Учётная запись не привязана к лаборатории');
      err.code = 'LAB_REQUIRED';
      err.status = 403;
      throw err;
    }
    if (raw != null && raw !== '' && Number(raw) !== Number(actorLab)) {
      const err = new Error(
        'lab_admin может назначить только свою лабораторию'
      );
      err.code = 'FORBIDDEN';
      err.status = 403;
      throw err;
    }
    // null/пусто в body тоже = «назначить свою» (heal orphan)
    payload.laboratory_id = actorLab;
    return payload;
  }

  delete payload.laboratory_id;
  return payload;
}

const createResearch = async (data, user) => {
  try {
    const payload = prepareResearchCreatePayload(user, data);
    const research = await Research.create(payload);
    await ensureActorMembership(user, research.id);
    return research;
  } catch (error) {
    console.error('Ошибка при создании исследования:', error);
    throw error;
  }
};

const getAllResearches = async (options = {}, user) => {
  try {
    const where = await scopeResearchesWhere(user, {});
    const query = { where, order: [['start_date', 'DESC']] };
    if (options.includeParticipants) {
      query.include = [participantInclude];
    }
    return await Research.findAll(query);
  } catch (error) {
    console.error('Ошибка при получении списка исследований:', error);
    throw error;
  }
};

const getResearchById = async (id, options = {}, user) => {
  try {
    const query = {};
    if (options.includeParticipants) {
      query.include = [participantInclude];
    }
    const research = await Research.findByPk(id, query);
    if (!research) {
      throw Object.assign(new Error(`Исследование с id ${id} не найдено`), {
        code: 'NOT_FOUND',
        status: 404,
      });
    }
    await assertCanViewResearch(user, research);
    return research;
  } catch (error) {
    console.error('Ошибка при получении исследования по id:', error);
    throw error;
  }
};

const updateResearch = async (id, data, user) => {
  try {
    const research = await Research.findByPk(id);
    if (!research) {
      throw Object.assign(new Error(`Исследование с id ${id} не найдено`), {
        code: 'NOT_FOUND',
        status: 404,
      });
    }
    await assertCanEditResearch(user, research);
    const payload = prepareResearchUpdatePayload(user, research, data);
    await research.update(payload);
    return research;
  } catch (error) {
    console.error('Ошибка при обновлении исследования:', error);
    throw error;
  }
};

const deleteResearch = async (id, user) => {
  try {
    const research = await Research.findByPk(id);
    if (!research) {
      throw Object.assign(new Error(`Исследование с id ${id} не найдено`), {
        code: 'NOT_FOUND',
        status: 404,
      });
    }
    await assertCanEditResearch(user, research);
    await research.destroy();
    return { message: `Исследование с id ${id} удалено` };
  } catch (error) {
    console.error('Ошибка при удалении исследования:', error);
    throw error;
  }
};

const createResearchWithParticipants = async (data, employeeIds, user) => {
  try {
    await assertEmployeesInActorLab(user, employeeIds);
    const payload = prepareResearchCreatePayload(user, data);
    const research = await Research.create(payload);

    const ids = [...new Set((employeeIds || []).map(Number).filter(Boolean))];
    if (user?.employee_id && !ids.includes(Number(user.employee_id))) {
      ids.push(Number(user.employee_id));
    }

    if (ids.length > 0) {
      await ResearchEmployee.bulkCreate(
        ids.map((employeeId) => ({
          research_id: research.id,
          employee_id: employeeId,
        }))
      );
    } else {
      await ensureActorMembership(user, research.id);
    }

    return research;
  } catch (error) {
    console.error('Ошибка при создании исследования с участниками:', error);
    throw error;
  }
};

const addResearchParticipants = async (researchId, employeeIds, user) => {
  try {
    const research = await Research.findByPk(researchId);
    if (!research) throw new Error('Research not found');

    // новое research без участников: system_admin ок; иначе только если уже в scope
    // или актор только что создал — для add требуем edit
    if (!skipLabScope(user)) {
      const inScope = await researchBelongsToActorScope(user, researchId);
      if (!inScope) {
        const count = await ResearchEmployee.count({
          where: { research_id: Number(researchId) },
        });
        if (count > 0) {
          await assertCanEditResearch(user, research);
        }
      } else {
        await assertCanEditResearch(user, research);
      }
    }

    await assertEmployeesInActorLab(user, employeeIds);

    // Уникальные id; уже состоящих в команде пропускаем (не 409 на весь batch)
    const uniqueIds = [
      ...new Set((employeeIds || []).map(Number).filter(Boolean)),
    ];
    const existingRows = uniqueIds.length
      ? await ResearchEmployee.findAll({
          where: {
            research_id: Number(researchId),
            employee_id: { [Op.in]: uniqueIds },
          },
          attributes: ['employee_id'],
        })
      : [];
    const alreadyIn = new Set(
      existingRows.map((row) => Number(row.employee_id))
    );
    const toAdd = uniqueIds.filter((id) => !alreadyIn.has(id));
    const skipped = uniqueIds.filter((id) => alreadyIn.has(id));

    if (toAdd.length) {
      try {
        await ResearchEmployee.bulkCreate(
          toAdd.map((employeeId) => ({
            research_id: Number(researchId),
            employee_id: employeeId,
          }))
        );
      } catch (error) {
        if (isUniqueMembershipError(error)) {
          throw Object.assign(
            new Error(
              'Не удалось добавить участников: конфликт уникальности membership'
            ),
            { code: 'CONFLICT', status: 409 }
          );
        }
        throw error;
      }
    }

    return {
      message: 'Participants added successfully',
      added: toAdd,
      skipped,
    };
  } catch (error) {
    console.error('Error adding participants:', error);
    throw error;
  }
};

const getOngoingResearchCount = async (user) => {
  try {
    const where = await scopeResearchesWhere(user, { status: 'Ongoing' });
    return await Research.count({ where });
  } catch (error) {
    console.error('Ошибка при подсчете ongoing-исследований:', error);
    throw error;
  }
};

module.exports = {
  createResearch,
  getAllResearches,
  getResearchById,
  updateResearch,
  deleteResearch,
  createResearchWithParticipants,
  addResearchParticipants,
  getOngoingResearchCount,
};
