import path from 'node:path';

export const MONGODB_VARS = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};

export const ENV_VARS = {
  PORT: 'PORT',
  JWT_SECRET: 'JWT_SECRET',
  APP_DOMAIN: 'APP_DOMAIN',
  GOOGLE_AUTH_CLIENT_ID: 'GOOGLE_AUTH_CLIENT_ID',
  GOOGLE_AUTH_CLIENT_SECRET: 'GOOGLE_AUTH_CLIENT_SECRET',
};

export const EMAIL_VARS = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'upload');
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
  CLOUD_ENABLED: 'CLOUDINARY_ENABLED',
};
