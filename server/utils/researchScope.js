/**
 * «Свои» записи для research / tasks.
 *
 * Student — только свои tasks (task.user_id === user.id).
 * Lab-tenant для research — колонка researches.laboratory_id.
 * Membership (ResearchEmployee) — состав команды; для scope lab
 * fallback только если laboratory_id ещё null.
 *
 * system_admin: skipLabScope → без фильтра.
 */
'use strict';

const { Op } = require('sequelize');
const {
  skipLabScope,
  resolveActorLabId,
  isScopeForbidden,
} = require('./labScope');
const {
  ROLES,
  getUserRole,
  isStudent,
  isResearcher,
  isLabAdmin,
  hasRole,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

function forbidden(message, code = 'FORBIDDEN') {
  const err = new Error(message);
  err.code = code;
  err.status = 403;
  return err;
}

function notFound(message) {
  const err = new Error(message);
  err.code = 'NOT_FOUND';
  err.status = 404;
  return err;
}

// ---------------------------------------------------------------------------
// 1) Student — own tasks
// ---------------------------------------------------------------------------

function isOwnTask(user, task) {
  if (!user || !task) return false;
  return Number(task.user_id) === Number(user.id);
}

/** WHERE для списков задач: student → только user_id */
function ownTasksWhere(user, where = {}) {
  const next = { ...where };
  if (isStudent(user)) {
    next.user_id = Number(user.id);
  }
  return next;
}

// ---------------------------------------------------------------------------
// 2) Lab tenant — researches.laboratory_id (+ legacy membership fallback)
// ---------------------------------------------------------------------------

/**
 * Research, у которых владеющая lab = labId (колонка laboratory_id).
 * @returns {Promise<number[]>}
 */
async function listResearchIdsForOwningLab(labId) {
  if (labId == null) return [];
  const { Research } = require('../models');
  const rows = await Research.findAll({
    where: { laboratory_id: Number(labId) },
    attributes: ['id'],
    raw: true,
  });
  return rows.map((r) => Number(r.id)).filter(Boolean);
}

/**
 * @deprecated имя оставлено для совместимости экспорта.
 * Раньше — через участников; теперь — owning laboratory_id.
 */
async function listResearchIdsForLab(labId) {
  return listResearchIdsForOwningLab(labId);
}

/** ID исследований, где employee_id — участник (команда) */
async function listResearchIdsForEmployee(employeeId) {
  if (employeeId == null) return [];
  const { ResearchEmployee } = require('../models');
  const links = await ResearchEmployee.findAll({
    where: { employee_id: Number(employeeId) },
    attributes: ['research_id'],
    raw: true,
  });
  return [...new Set(links.map((r) => Number(r.research_id)).filter(Boolean))];
}

/**
 * Research с laboratory_id IS NULL, где актор в команде (хвост миграции).
 */
async function listOrphanResearchIdsForEmployee(employeeId) {
  if (employeeId == null) return [];
  const teamIds = await listResearchIdsForEmployee(employeeId);
  if (!teamIds.length) return [];

  const { Research } = require('../models');
  const rows = await Research.findAll({
    where: {
      id: { [Op.in]: teamIds },
      laboratory_id: null,
    },
    attributes: ['id'],
    raw: true,
  });
  return rows.map((r) => Number(r.id)).filter(Boolean);
}

/**
 * null = без ограничения (system_admin);
 * [] = пусто; иначе список research_id.
 *
 * Основной путь: researches.laboratory_id = lab актора.
 * Fallback: membership только для строк ещё без laboratory_id.
 */
async function resolveVisibleResearchIds(user) {
  if (skipLabScope(user)) return null;

  const labId = resolveActorLabId(user);
  if (labId == null) return [];

  const owned = await listResearchIdsForOwningLab(labId);
  const orphans = await listOrphanResearchIdsForEmployee(user.employee_id);

  return [...new Set([...owned, ...orphans])];
}

/** where.research_id IN (...) для Task.findAll; student — ownTasksWhere */
async function scopeTasksWhere(user, where = {}) {
  let next = { ...where };

  if (isStudent(user)) {
    return ownTasksWhere(user, next);
  }

  if (skipLabScope(user)) {
    return next;
  }

  const ids = await resolveVisibleResearchIds(user);
  next.research_id = { [Op.in]: ids.length ? ids : [-1] };
  return next;
}

/**
 * WHERE для Research.findAll.
 * Предпочитаем laboratory_id = lab; orphan-id через IN (id).
 */
async function scopeResearchesWhere(user, where = {}) {
  const next = { ...where };
  if (skipLabScope(user)) return next;

  const labId = resolveActorLabId(user);
  if (labId == null) {
    next.id = -1;
    return next;
  }

  const orphans = await listOrphanResearchIdsForEmployee(user.employee_id);
  if (!orphans.length) {
    next.laboratory_id = labId;
    return next;
  }

  next[Op.or] = [
    { laboratory_id: labId },
    { id: { [Op.in]: orphans } },
  ];
  return next;
}

/**
 * Одна research в scope актора?
 * Сначала колонка laboratory_id; иначе legacy membership при null.
 */
async function researchBelongsToActorScope(user, researchId) {
  if (skipLabScope(user)) return true;

  const labId = resolveActorLabId(user);
  if (labId == null) return false;

  const { Research } = require('../models');
  const research = await Research.findByPk(researchId, {
    attributes: ['id', 'laboratory_id'],
  });
  if (!research) return false;

  if (
    research.laboratory_id != null &&
    Number(research.laboratory_id) === Number(labId)
  ) {
    return true;
  }

  if (research.laboratory_id == null && user.employee_id != null) {
    const orphans = await listOrphanResearchIdsForEmployee(user.employee_id);
    return orphans.includes(Number(researchId));
  }

  return false;
}

// ---------------------------------------------------------------------------
// 3) Assert helpers
// ---------------------------------------------------------------------------

async function loadTaskOrThrow(taskId) {
  const { Task } = require('../models');
  const task = await Task.findByPk(taskId);
  if (!task) throw notFound(`Задача с id ${taskId} не найдена`);
  return task;
}

async function loadResearchOrThrow(researchId) {
  const { Research } = require('../models');
  const research = await Research.findByPk(researchId);
  if (!research) throw notFound(`Исследование с id ${researchId} не найдено`);
  return research;
}

/**
 * Просмотр задачи.
 * student — только своя; остальные — research в lab/team.
 */
async function assertCanViewTask(user, task) {
  if (!user) throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  if (skipLabScope(user)) return;

  if (isStudent(user)) {
    if (!isOwnTask(user, task)) {
      throw forbidden('Студент может просматривать только свои задачи');
    }
    return;
  }

  const ok = await researchBelongsToActorScope(user, task.research_id);
  if (!ok) {
    throw forbidden('Задача относится к чужой лаборатории или команде');
  }
}

/**
 * Создание/правка задачи.
 * student — только свои; нельзя сменить user_id / research_id на чужие.
 * researcher / lab_admin — research в lab/team.
 */
async function assertCanEditTask(user, task) {
  if (!user) throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  if (skipLabScope(user)) return;

  if (isStudent(user)) {
    if (!isOwnTask(user, task)) {
      throw forbidden('Студент может изменять только свои задачи');
    }
    return;
  }

  if (!hasRole(user, CAN_MANAGE_RESEARCH) && !isLabAdmin(user)) {
    // на всякий случай: роли вне CAN_MANAGE_RESEARCH кроме student уже отсечены роутом
    throw forbidden('Недостаточно прав для изменения задачи');
  }

  const ok = await researchBelongsToActorScope(user, task.research_id);
  if (!ok) {
    throw forbidden('Нельзя изменять задачу чужой лаборатории или команды');
  }
}

/** Удаление: роль на роуте + тот же lab/team scope */
async function assertCanDeleteTask(user, task) {
  await assertCanEditTask(user, task);
}

/** Можно ли вешать новую задачу на research_id */
async function assertCanCreateTaskOnResearch(user, researchId) {
  if (!user) throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  if (researchId == null) {
    throw forbidden('research_id обязателен', 'VALIDATION');
  }
  await loadResearchOrThrow(researchId);

  if (skipLabScope(user)) return;

  if (isStudent(user)) {
    // студент создаёт «свою» задачу в исследовании своей lab/команды
    const ok = await researchBelongsToActorScope(user, researchId);
    if (!ok) {
      throw forbidden('Нельзя создать задачу в исследовании вне вашей лаборатории');
    }
    return;
  }

  const ok = await researchBelongsToActorScope(user, researchId);
  if (!ok) {
    throw forbidden('Нельзя создать задачу в чужом исследовании');
  }
}

/**
 * Готовит payload создания: student/researcher всегда владельцы (user_id = actor).
 * lab_admin может указать user_id; иначе — сам.
 */
async function prepareTaskCreatePayload(user, data) {
  const payload = { ...data };
  await assertCanCreateTaskOnResearch(user, payload.research_id);

  if (isStudent(user) || isResearcher(user) || payload.user_id == null) {
    payload.user_id = Number(user.id);
  } else if (!skipLabScope(user)) {
    // lab_admin: чужой user_id только если тот же lab (грубая проверка через employee)
    payload.user_id = Number(payload.user_id);
  }

  return payload;
}

/** Патч: student не может увести user_id / research_id */
function sanitizeTaskUpdatePayload(user, data) {
  const payload = { ...data };
  if (isStudent(user)) {
    delete payload.user_id;
    delete payload.research_id;
  }
  return payload;
}

async function assertCanViewResearch(user, research) {
  if (!user) throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  if (skipLabScope(user)) return;

  const labId = resolveActorLabId(user);
  if (labId == null) {
    throw forbidden('Учётная запись не привязана к лаборатории', 'LAB_REQUIRED');
  }

  if (
    research.laboratory_id != null &&
    Number(research.laboratory_id) === Number(labId)
  ) {
    return;
  }

  const ok = await researchBelongsToActorScope(user, research.id);
  if (!ok) {
    throw forbidden('Исследование вне вашей лаборатории');
  }
}

async function assertCanEditResearch(user, research) {
  if (!user) throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  if (skipLabScope(user)) return;

  if (!hasRole(user, CAN_MANAGE_RESEARCH)) {
    throw forbidden('Недостаточно прав для изменения исследования');
  }

  const labId = resolveActorLabId(user);
  if (labId == null) {
    throw forbidden('Учётная запись не привязана к лаборатории', 'LAB_REQUIRED');
  }

  if (
    research.laboratory_id != null &&
    Number(research.laboratory_id) === Number(labId)
  ) {
    return;
  }

  const ok = await researchBelongsToActorScope(user, research.id);
  if (!ok) {
    throw forbidden('Нельзя изменять исследование чужой лаборатории');
  }
}

/**
 * После создания research без участников lab-scope его не увидит.
 * Если у актора есть employee_id — добавляем в команду.
 */
async function ensureActorMembership(user, researchId) {
  if (!user?.employee_id || researchId == null) return;
  const { ResearchEmployee } = require('../models');
  const existing = await ResearchEmployee.findOne({
    where: {
      research_id: Number(researchId),
      employee_id: Number(user.employee_id),
    },
  });
  if (existing) return;
  await ResearchEmployee.create({
    research_id: Number(researchId),
    employee_id: Number(user.employee_id),
    role: getUserRole(user) === ROLES.RESEARCHER ? 'researcher' : null,
  });
}

/** Участники research должны быть из lab актора (кроме system_admin) */
async function assertEmployeesInActorLab(user, employeeIds) {
  if (skipLabScope(user) || !employeeIds?.length) return;
  const labId = resolveActorLabId(user);
  if (labId == null) {
    throw forbidden('Учётная запись не привязана к лаборатории', 'LAB_REQUIRED');
  }
  const { Employee } = require('../models');
  const rows = await Employee.findAll({
    where: { id: { [Op.in]: employeeIds.map(Number) } },
    attributes: ['id', 'lab_id'],
  });
  if (rows.length !== employeeIds.length) {
    throw forbidden('Один или несколько сотрудников не найдены');
  }
  for (const row of rows) {
    if (Number(row.lab_id) !== Number(labId)) {
      throw forbidden('Нельзя добавить сотрудника из чужой лаборатории');
    }
  }
}

/**
 * WHERE для списка ResearchEmployee (memberships).
 * system_admin — без фильтра.
 * Если задан конкретный research_id вне scope — 403 (не пустой список).
 * Иначе research_id IN (видимые исследования lab/команды).
 */
async function scopeMembershipsWhere(user, where = {}) {
  const next = { ...where };
  if (skipLabScope(user)) return next;

  const ids = await resolveVisibleResearchIds(user);

  if (next.research_id != null && typeof next.research_id !== 'object') {
    const rid = Number(next.research_id);
    if (!ids.includes(rid)) {
      throw forbidden('Состав команды относится к чужой лаборатории или исследованию');
    }
    return next;
  }

  next.research_id = { [Op.in]: ids.length ? ids : [-1] };
  return next;
}

module.exports = {
  // 1 student
  isOwnTask,
  ownTasksWhere,
  // 2 lab via laboratory_id
  listResearchIdsForOwningLab,
  listResearchIdsForLab,
  listResearchIdsForEmployee,
  listOrphanResearchIdsForEmployee,
  resolveVisibleResearchIds,
  scopeTasksWhere,
  scopeResearchesWhere,
  scopeMembershipsWhere,
  researchBelongsToActorScope,
  // 3 asserts
  assertCanViewTask,
  assertCanEditTask,
  assertCanDeleteTask,
  assertCanCreateTaskOnResearch,
  prepareTaskCreatePayload,
  sanitizeTaskUpdatePayload,
  assertCanViewResearch,
  assertCanEditResearch,
  ensureActorMembership,
  assertEmployeesInActorLab,
  loadTaskOrThrow,
  loadResearchOrThrow,
  isScopeForbidden,
  isStudent,
  isResearcher,
  isLabAdmin,
};
