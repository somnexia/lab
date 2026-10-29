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
} = require('../utils/labScope');

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
 * Update payload: laboratory_id меняет только system_admin (явный body).
 *
 * Обычные роли: laboratory_id из body выкидываем.
 * Не подставляем lab актора при null — иначе участник чужой lab
 * мог бы «увести» orphan-проект к себе первым PUT.
 * Orphan (null) чинит миграция / admin, не heal-on-update.
 */
function prepareResearchUpdatePayload(user, research, data = {}) {
  const payload = { ...data };
  delete payload.laboratoryId;

  if (skipLabScope(user)) {
    if (data.laboratory_id !== undefined || data.laboratoryId !== undefined) {
      const raw = data.laboratory_id ?? data.laboratoryId;
      payload.laboratory_id = raw == null || raw === '' ? null : Number(raw);
    }
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
    const participants = employeeIds.map((employeeId) => ({
      research_id: researchId,
      employee_id: employeeId,
    }));
    await ResearchEmployee.bulkCreate(participants);
    return { message: 'Participants added successfully' };
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
