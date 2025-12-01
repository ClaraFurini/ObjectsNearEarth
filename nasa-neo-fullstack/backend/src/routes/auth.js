import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/security.js';
import { generateToken, blacklistToken } from '../utils/token.js';
import { logSecurityEvent, logSecurityWarning } from '../utils/logger.js';
import { sanitizeEmail } from '../utils/validation.js';

const router = express.Router();

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = sanitizeEmail(email || '');
    if (!email || !password) {
      logSecurityWarning('AUTH_VALIDATION_FAILED', { ip: req.ip, reason: 'missing_fields' });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      logSecurityWarning('AUTH_INVALID_CREDENTIALS', { ip: req.ip, email: normalizedEmail });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      logSecurityWarning('AUTH_INVALID_CREDENTIALS', { ip: req.ip, email: normalizedEmail });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    logSecurityEvent('AUTH_SUCCESS', { ip: req.ip, userId: user._id.toString() });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await blacklistToken(req.tokenPayload?.jti, req.tokenPayload?.exp);
    logSecurityEvent('AUTH_LOGOUT', { ip: req.ip, userId: req.user.id });
    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    return next(err);
  }
});

export default router;
