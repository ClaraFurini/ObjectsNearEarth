import express from 'express';
import Neo from '../models/Neo.js';
import { authenticate } from '../middlewares/auth.js';
import { getRedisClient } from '../config/redis.js';
import { logSecurityEvent, logSecurityWarning } from '../utils/logger.js';
import { ensureNumber, isBooleanString, sanitizeText } from '../utils/validation.js';

const router = express.Router();
const CACHE_PREFIX = 'neo:search:';
const CACHE_TTL = 60;

const buildCacheKey = (filters) => {
  const { date, isHazardous } = filters;
  return `${CACHE_PREFIX}${date || 'any'}:${isHazardous || 'any'}`;
};

const buildDateRange = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return { $gte: start, $lte: end };
};

router.get('/neos', authenticate, async (req, res, next) => {
  try {
    const { date, isHazardous } = req.query;
    const filters = {};
    if (date) {
      const range = buildDateRange(date);
      if (!range) {
        logSecurityWarning('SEARCH_INVALID_DATE', { ip: req.ip, date });
        return res.status(400).json({ message: 'Data inválida' });
      }
      filters.date = range;
    }
    if (isBooleanString(isHazardous)) {
      filters.isHazardous = isHazardous === 'true';
    }

    const cacheKey = buildCacheKey(req.query);
    const redis = getRedisClient();
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logSecurityEvent('SEARCH_CACHE_HIT', { ip: req.ip, cacheKey });
        return res.json(JSON.parse(cached));
      }
    }

    const neos = await Neo.find(filters).sort({ date: -1 });
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(neos), 'EX', CACHE_TTL);
    }
    logSecurityEvent('SEARCH_EXECUTED', { ip: req.ip, filters: Object.keys(filters) });
    return res.json(neos);
  } catch (err) {
    return next(err);
  }
});

router.post('/neos', authenticate, async (req, res, next) => {
  try {
    const { name, date, distanceKm, isHazardous, material } = req.body || {};
    const sanitizedName = sanitizeText(name || '');
    const sanitizedMaterial = sanitizeText(material || '');
    const numericDistance = ensureNumber(distanceKm);
    if (
      !sanitizedName ||
      !date ||
      numericDistance === null ||
      typeof isHazardous !== 'boolean' ||
      !sanitizedMaterial
    ) {
      logSecurityWarning('CREATE_VALIDATION_FAILED', { ip: req.ip, userId: req.user.id });
      return res.status(400).json({ message: 'All fields are required' });
    }

    const neo = await Neo.create({
      name: sanitizedName,
      date,
      distanceKm: numericDistance,
      isHazardous,
      material: sanitizedMaterial,
      createdBy: req.user.id,
    });

    const redis = getRedisClient();
    if (redis) {
      const keys = await redis.keys(`${CACHE_PREFIX}*`);
      if (keys.length) {
        await redis.del(keys);
      }
    }

    logSecurityEvent('CREATE_NEO', { ip: req.ip, userId: req.user.id, neoId: neo._id.toString() });
    return res.status(201).json(neo);
  } catch (err) {
    return next(err);
  }
});

export default router;
