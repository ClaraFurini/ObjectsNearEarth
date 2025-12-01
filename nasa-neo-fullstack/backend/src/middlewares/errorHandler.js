import { logSecurityError } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logSecurityError('UNHANDLED_ERROR', { path: req.path, message: err.message });
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
