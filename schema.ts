import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { isAdmin, isLoggedIn } from "./helpers";

import {
  text,
  relationship,
  password,
  checkbox,
  file,
  image,
  timestamp,
} from '@keystone-6/core/fields';

import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    fields: {
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      isAdmin: checkbox({
        defaultValue: false
      }),

      password: password({ validation: { isRequired: true } }),

      username: text({
        validation: {
          isRequired: true,
        },
        isIndexed: "unique"
      }),
      createdModels: relationship({ ref: 'Model.createdBy', many: true }),
    },
    access: {
      operation: {
        create: allowAll,
        query: allowAll,
        update: async ({ session, context, listKey, operation }) => {
          return await isAdmin(session.data.email, context);
        },
        delete: async ({ session, context, listKey, operation }) => {
          return await isAdmin(session.data.email, context);
        }
      }
    }
  }),
  Model: list({
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      description: text({validation: {isRequired: false}}),
      modelFile: file({ storage: 'model_files' }),
      modelImage: image({ storage: 'model_images'}),
      createdAt: timestamp({ defaultValue: { kind: 'now' }}),
      createdBy: relationship({ ref: 'User.createdModels', ui: {
        labelField: 'username'
      } }),
    },
    access: {
      operation: {
        create: async ({ session, context, listKey, operation }) => {
          return await isLoggedIn(session.data.email, context);
        },
        query: allowAll,
        update: async ({ session, context, listKey, operation }) => {
          return await isAdmin(session.data.email, context);
        },
        delete: async ({ session, context, listKey, operation }) => {
          return await isAdmin(session.data.email, context);
        }
      }
    },
  })

};
