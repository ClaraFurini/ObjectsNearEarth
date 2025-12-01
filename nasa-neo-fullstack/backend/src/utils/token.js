import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getRedisClient } from '../config/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1h';
const TOKEN_BLACKLIST_PREFIX = 'blacklist:token:';

export const generateToken = (userId) => {
  const jti = crypto.randomUUID();
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, jwtid: jti });
};

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

export const blacklistToken = async (jti, exp) => {
  const redis = getRedisClient();
  if (!redis || !jti || !exp) return;
  const ttlMs = exp * 1000 - Date.now();
  if (ttlMs <= 0) return;
  await redis.set(`${TOKEN_BLACKLIST_PREFIX}${jti}`, 'revoked', 'PX', ttlMs);
};

export const isTokenBlacklisted = async (jti) => {
  const redis = getRedisClient();
  if (!redis || !jti) return false;
  const value = await redis.get(`${TOKEN_BLACKLIST_PREFIX}${jti}`);
  return Boolean(value);
};
