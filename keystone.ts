import { config } from '@keystone-6/core';
import dotenv from 'dotenv';
import { lists } from './schema';
import { withAuth, session } from './auth';

dotenv.config();

const {
  S3_BUCKET_NAME: bucketName = '',
  S3_REGION: region = '',
  S3_ACCESS_KEY_ID: accessKeyId = '',
  S3_SECRET_ACCESS_KEY: secretAccessKey = '',
  DATABASE_URL: databaseUrl = '',
} = process.env;

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url: databaseUrl,
    },
    lists,
    session,
    server: {
      cors: { origin: "http://localhost:5000", credentials: true }
    },
    storage: {
      model_files: {
        kind: 's3',
        type: 'image',
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        signed: { expiry: 5000 },
      },
      model_images: {
        kind: 's3',
        type: 'image',
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        signed: { expiry: 5000 },
      }
    }
  })
);
