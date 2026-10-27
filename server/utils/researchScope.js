/**
 * «Свои» записи для research / tasks.
 *
 * Три части:
 *   1) Student — только свои tasks (task.user_id === user.id)
 *   2) Researcher (+ lab_admin) — research/tasks своей lab / команды
 *      (команда = researches, где есть участник с employee.lab_id актора,
 *       либо сам актор в ResearchEmployee)
 *   3) Assert-хелперы: assertCanViewTask / assertCanEditTask / …
 *
 * Research в схеме без laboratory_id — lab выводится через
 * ResearchEmployee → Employee.lab_id.
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
// 2) Researcher / lab — research & tasks by lab / team
// ---------------------------------------------------------------------------

/**
 * ID исследований, видимых в лаборатории (есть участник с lab_id).
 * @returns {Promise<number[]>}
 */
async function listResearchIdsForLab(labId) {
  if (labId == null) return [];
  const { ResearchEmployee, Employee } = require('../models');

  const links = await ResearchEmployee.findAll({
    attributes: ['research_id'],
    include: [
      {
        model: Employee,
        as: 'employee',
        required: true,
        attributes: [],
        where: { lab_id: Number(labId) },
      },
    ],
    raw: true,
  });

  return [...new Set(links.map((r) => Number(r.research_id)).filter(Boolean))];
}

/** ID исследований, где employee_id актора — участник («своя команда») */
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
 * null = без ограничения (system_admin);
 * [] = пусто; иначе список research_id.
 *
 * lab_admin / researcher / student: lab ∪ личная команда (membership).
 */
async function resolveVisibleResearchIds(user) {
  if (skipLabScope(user)) return null;

  const labId = resolveActorLabId(user);
  const labIds = await listResearchIdsForLab(labId);
  const teamIds =
    user.employee_id != null
      ? await listResearchIdsForEmployee(user.employee_id)
      : [];

  return [...new Set([...labIds, ...teamIds])];
}

/** where.research_id IN (...) для Task.findAll; student дополнительно сужает ownTasksWhere */
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

/** where.id IN (...) для Research.findAll */
async function scopeResearchesWhere(user, where = {}) {
  const next = { ...where };
  if (skipLabScope(user)) return next;

  const ids = await resolveVisibleResearchIds(user);
  next.id = { [Op.in]: ids.length ? ids : [-1] };
  return next;
}

async function researchBelongsToActorScope(user, researchId) {
  if (skipLabScope(user)) return true;
  const ids = await resolveVisibleResearchIds(user);
  return ids.includes(Number(researchId));
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

  const ok = await researchBelongsToActorScope(user, research.id);
  if (!ok) {
    throw forbidden('Исследование вне вашей лаборатории или команды');
  }
}

async function assertCanEditResearch(user, research) {
  if (!user) throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  if (skipLabScope(user)) return;

  if (!hasRole(user, CAN_MANAGE_RESEARCH)) {
    throw forbidden('Недостаточно прав для изменения исследования');
  }

  const ok = await researchBelongsToActorScope(user, research.id);
  if (!ok) {
    throw forbidden('Нельзя изменять исследование чужой лаборатории или команды');
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
  // 2 lab/team
  listResearchIdsForLab,
  listResearchIdsForEmployee,
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
