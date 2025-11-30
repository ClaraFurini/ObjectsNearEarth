import express from 'express';
import Neo from '../models/Neo.js';
import { authenticate } from '../middlewares/auth.js';
import { getRedisClient } from '../config/redis.js';

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
        return res.status(400).json({ message: 'Data inválida' });
      }
      filters.date = range;
    }
    if (isHazardous === 'true' || isHazardous === 'false') {
      filters.isHazardous = isHazardous === 'true';
    }

    const cacheKey = buildCacheKey(req.query);
    const redis = getRedisClient();
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const neos = await Neo.find(filters).sort({ date: -1 });
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(neos), 'EX', CACHE_TTL);
    }
    return res.json(neos);
  } catch (err) {
    return next(err);
  }
});

router.post('/neos', authenticate, async (req, res, next) => {
  try {
    const { name, date, distanceKm, isHazardous, material } = req.body || {};
    if (!name || !date || distanceKm === undefined || isHazardous === undefined || !material) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const neo = await Neo.create({
      name,
      date,
      distanceKm,
      isHazardous,
      material,
      createdBy: req.user.id,
    });

    const redis = getRedisClient();
    if (redis) {
      const keys = await redis.keys(`${CACHE_PREFIX}*`);
      if (keys.length) {
        await redis.del(keys);
      }
    }

    return res.status(201).json(neo);
  } catch (err) {
    return next(err);
  }
});

export default router;
