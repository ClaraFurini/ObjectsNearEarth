const buildPayload = (event, details = {}, level = 'info') => ({
  event,
  level,
  timestamp: new Date().toISOString(),
  ...details,
});

export const logSecurityEvent = (event, details = {}) => {
  console.info('[SECURITY]', buildPayload(event, details));
};

export const logSecurityWarning = (event, details = {}) => {
  console.warn('[SECURITY]', buildPayload(event, details, 'warn'));
};

export const logSecurityError = (event, details = {}) => {
  console.error('[SECURITY]', buildPayload(event, details, 'error'));
};
