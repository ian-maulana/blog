export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || '';

export const JWT_SECRET = process.env.JWT_SECRET || '';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '';
export const JWT_COOKIE_EXPIRE = Number(process.env.JWT_COOKIE_EXPIRE) || 30;

export const SMTP_EMAIL = process.env.SMTP_EMAIL || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const FROM_EMAIL = process.env.FROM_EMAIL || '';
export const FROM_NAME = process.env.FROM_NAME || '';
