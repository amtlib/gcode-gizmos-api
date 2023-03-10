import { config } from '@keystone-6/core';
import dotenv from 'dotenv';
import { lists } from './schema';
import { withAuth, session } from './auth';
import { DATABASE_URL, S3_ACCESS_KEY_ID, S3_BUCKET_NAME, S3_REGION, S3_SECRET_ACCESS_KEY } from './config';
import { KeystoneConfig, BaseKeystoneTypeInfo } from '@keystone-6/core/types';
import { isAdmin } from './helpers';

dotenv.config();

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url: DATABASE_URL
    },
    ui: {
      isAccessAllowed: (context) => {
        if (context.session) {
          return isAdmin(context?.session?.data?.username, context)
        }
        return false;
      }
    },
    lists,
    session,
    server: {
      cors: { origin: ["http://localhost:5000", "https://gcode-gizmos-frontend-production.up.railway.app"], credentials: true }
    },
    storage: {
      model_files: {
        kind: 's3',
        type: 'file',
        bucketName: S3_BUCKET_NAME,
        region: S3_REGION,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        signed: { expiry: 5000 },
      },
      model_images: {
        kind: 's3',
        type: 'image',
        bucketName: S3_BUCKET_NAME,
        region: S3_REGION,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        signed: { expiry: 5000 },
      }
    },
    graphql: {
      playground: true,
      apolloConfig: {
        introspection: true
      }
    }
  })
);
