const { Op, Sequelize } = require('sequelize');
const { Log, User } = require('../models');

/** Canonical audit action names — use these from services/controllers for consistent filtering */
const LOG_ACTIONS = {
  REGISTER: 'REGISTER',
  REGISTER_FAILED: 'REGISTER_FAILED',
  LOGIN: 'LOGIN',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
  RESEARCH_CREATED: 'RESEARCH_CREATED',
  CART_ITEM_ADDED: 'CART_ITEM_ADDED',
  CART_ITEM_REMOVED: 'CART_ITEM_REMOVED',
  CART_CLEARED: 'CART_CLEARED',
};

const LOG_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
};

/**
 * Extract client metadata from an Express request (optional).
 * @param {import('express').Request} req
 */
function getRequestMeta(req) {
  if (!req) {
    return { ip: null, userAgent: null, sessionId: null };
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip || req.socket?.remoteAddress || null;
  return {
    ip: ip || null,
    userAgent: req.get?.('user-agent') || null,
    sessionId: req.sessionID || req.headers['x-session-id'] || null,
  };
}

/**
 * Merge explicit meta with request-derived fields when `req` is passed.
 * @param {{ ip?: string|null, userAgent?: string|null, sessionId?: string|null }} meta
 * @param {import('express').Request} [req]
 */
function mergeMeta(meta = {}, req) {
  const fromReq = getRequestMeta(req);
  return {
    ip: meta.ip ?? fromReq.ip,
    userAgent: meta.userAgent ?? fromReq.userAgent,
    sessionId: meta.sessionId ?? fromReq.sessionId,
  };
}

function normalizeResourceId(resourceId) {
  if (resourceId === null || resourceId === undefined || resourceId === '') return null;
  const n = Number(resourceId);
  return Number.isNaN(n) ? null : n;
}

function formatDetails(details) {
  if (details == null) return null;
  if (typeof details === 'string') return details;
  try {
    return JSON.stringify(details);
  } catch {
    return String(details);
  }
}

/**
 * @param {object} payload
 * @param {string} payload.action
 * @param {number|null} [payload.userId]
 * @param {string|null} [payload.resourceType]
 * @param {number|string|null} [payload.resourceId]
 * @param {string|object|null} [payload.description]
 * @param {string} [payload.status]
 * @param {string|null} [payload.ip]
 * @param {string|null} [payload.userAgent]
 * @param {string|null} [payload.sessionId]
 */
async function recordAuditLog({
  action,
  userId = null,
  resourceType = null,
  resourceId = null,
  description = null,
  status = LOG_STATUS.SUCCESS,
  ip = null,
  userAgent = null,
  sessionId = null,
}) {
  return Log.create({
    action,
    user_id: userId,
    resource_type: resourceType,
    resource_id: normalizeResourceId(resourceId),
    description: formatDetails(description),
    status,
    ip_address: ip,
    user_agent: userAgent,
    session_id: sessionId,
    timestamp: new Date(),
  });
}

/**
 * Non-throwing wrapper for use after business logic; failures only hit console.
 */
async function safeRecordAuditLog(payload) {
  try {
    await recordAuditLog(payload);
  } catch (err) {
    console.error('[audit] Failed to write log:', err.message);
  }
}

/** @deprecated Prefer recordAuditLog({ action, userId, description, ... }) */
const createLog = async (action, userId, details = null) =>
  recordAuditLog({
    action,
    userId,
    description: formatDetails(details),
    status: LOG_STATUS.SUCCESS,
  });

/**
 * @param {Object} options
 * @param {number} [options.limit]
 * @param {number} [options.offset]
 * @param {string} [options.search]
 * @param {string} [options.status]
 * @param {string} [options.action]
 * @param {string} [options.resourceType]
 * @param {string|number} [options.userId]
 * @param {string} [options.dateFrom] ISO date string
 * @param {string} [options.dateTo] ISO date string
 */
const getAllLogs = async ({
  limit = 10,
  offset = 0,
  search = '',
  status = '',
  action = '',
  resourceType = '',
  userId = '',
  dateFrom = '',
  dateTo = '',
} = {}) => {
  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { action: { [Op.like]: `%${search}%` } },
      { resource_type: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { ip_address: { [Op.like]: `%${search}%` } },
    ];
  }

  if (status) {
    whereClause.status = Sequelize.where(
      Sequelize.fn('LOWER', Sequelize.col('status')),
      String(status).toLowerCase()
    );
  }

  if (action) {
    whereClause.action = { [Op.like]: `%${action}%` };
  }

  if (resourceType) {
    whereClause.resource_type = { [Op.like]: `%${resourceType}%` };
  }

  if (userId !== '' && userId != null) {
    const uid = Number(userId);
    if (!Number.isNaN(uid)) {
      whereClause.user_id = uid;
    }
  }

  if (dateFrom || dateTo) {
    whereClause.timestamp = {};
    if (dateFrom) {
      whereClause.timestamp[Op.gte] = new Date(dateFrom);
    }
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      whereClause.timestamp[Op.lte] = end;
    }
  }

  const { rows: logs, count: totalLogs } = await Log.findAndCountAll({
    where: whereClause,
    limit: Math.min(Math.max(Number(limit) || 10, 1), 100),
    offset: Math.max(Number(offset) || 0, 0),
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
        required: false,
      },
    ],
    order: [['timestamp', 'DESC']],
  });

  return { logs, totalLogs };
};

module.exports = {
  LOG_ACTIONS,
  LOG_STATUS,
  getRequestMeta,
  mergeMeta,
  recordAuditLog,
  safeRecordAuditLog,
  createLog,
  getAllLogs,
};
