import { verifyToken } from '../utils/token.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
