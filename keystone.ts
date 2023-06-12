import { config, graphql } from '@keystone-6/core';
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
      cors: { origin: ["http://localhost:5000", "https://gcode-gizmos.grzegorzpach.pl"], credentials: true }
    },
    storage: {
      model_files: {
        kind: 's3',
        type: 'file',
        pathPrefix: 'files/',
        bucketName: S3_BUCKET_NAME,
        region: S3_REGION,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      },
      model_images: {
        kind: 's3',
        type: 'image',
        pathPrefix: 'images/',
        bucketName: S3_BUCKET_NAME,
        region: S3_REGION,
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
      }
    },
    graphql: {
      playground: true,
      apolloConfig: {
        introspection: true
      }
    },
    extendGraphqlSchema: graphql.extend(base => {
      return {
        mutation: {
          rateModel: graphql.field({
            type: graphql.Boolean,
            args: {
              score: graphql.arg({ type: graphql.Int }),
              modelSlug: graphql.arg({ type: graphql.String }),
            },
            async resolve(item, args, context, info) {
              const username = context.session?.data.username as string;
              if (!username) {
                return false;
              }
              const user = await context.query.User.findOne({
                where: {
                  username
                },
                query: `id`
              })

              const foundRate = await context.query.Rating.findMany({ where: { user: { id: { equals: user.id } }, model: { slug: { equals: args.modelSlug } } } });
              if (foundRate[0]?.id) {
                // update existing rate
                await context.query.Rating.updateOne({ where: { id: foundRate[0].id }, data: { score: args.score } });
                return true;
              } else {
                // create new rate
                await context.query.Rating.createOne({ data: { user: { connect: { id: user.id } }, model: { connect: { slug: args.modelSlug } }, score: args.score } })
              }
              return true;
            }
          })
        }
      }
    })
  })
);
