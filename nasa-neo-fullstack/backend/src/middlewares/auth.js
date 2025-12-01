import { verifyToken, isTokenBlacklisted } from '../utils/token.js';
import { logSecurityWarning } from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    logSecurityWarning('AUTHORIZATION_HEADER_MISSING', { path: req.path, ip: req.ip });
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = verifyToken(token);
    const revoked = await isTokenBlacklisted(decoded.jti);
    if (revoked) {
      logSecurityWarning('TOKEN_REJECTED', { path: req.path, ip: req.ip, reason: 'revoked' });
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { id: decoded.userId };
    req.tokenPayload = decoded;
    req.rawToken = token;
    return next();
  } catch (err) {
    logSecurityWarning('TOKEN_VERIFICATION_FAILED', { path: req.path, ip: req.ip });
    return res.status(401).json({ message: 'Invalid token' });
  }
};
