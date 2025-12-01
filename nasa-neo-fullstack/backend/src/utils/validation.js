const sanitizeString = (value = '') => value.toString().trim();

export const sanitizeEmail = (value) => sanitizeString(value).toLowerCase();

export const sanitizeText = (value) => sanitizeString(value).replace(/[<>]/g, '');

export const isBooleanString = (value) => value === 'true' || value === 'false';

export const ensureNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};
