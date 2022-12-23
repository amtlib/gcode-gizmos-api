import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT) || 3000;

export const DATABASE_URL =
    process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost/keystone-6-example`;

// Default to 30 days
export const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE) || 60 * 60 * 24 * 30;

export const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    require('crypto')
        .randomBytes(32)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]+/g, '');
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'gcode-gizmos'
export const S3_REGION = process.env.S3_REGION || 'eu-west-1'
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || ''
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || ''