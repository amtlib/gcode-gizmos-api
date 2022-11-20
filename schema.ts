// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';
import { DateTime } from '@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema';

const isAdmin = ({ session }: { session: { data: { isAdmin: boolean } } }) => session?.data.isAdmin;

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: {
      operation: {
        query: allowAll,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
    },

    fields: {
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      firstName: text({
        validation: {
          isRequired: true
        }
      }),
      lastName: text({
        validation: {
          isRequired: true
        }
      }),
      createdTasks: relationship({ ref: 'Task.createdBy', many: true }),
      assignedTasks: relationship({ ref: 'Task.assignedUser', many: true })
    },
  }),
  AssigneeUser: list({
    access: allowAll,
    fields: {
      project: relationship({ ref: 'Project' }),
      user: relationship({ ref: 'User' }),
      role: select({
        type: 'enum',
        options: [
          { label: "Administrator", value: "admin" },
          { label: "Kierownik", value: "manager" },
          { label: "Klient", value: "client" },
          { label: "Uzytkownik", value: "user" },
        ]
      })
    }
  }),
  Project: list({
    access: allowAll,

    fields: {
      title: text({
        validation: {
          isRequired: true
        }
      }),
      description: text({
        validation: {
          isRequired: true
        }
      }),
      tasks: relationship({ ref: 'Task.project', many: true })
    }
  }),
  Task: list({
    access: allowAll,
    fields: {
      project: relationship({ ref: 'Project.tasks' }),
      createdBy: relationship({ ref: 'User.createdTasks' }),
      assignedUser: relationship({ ref: 'User.assignedTasks' }),
      dueDate: timestamp(),
      estimatedTime: integer(),
      priority: select({
        type: 'enum',
        options: [
          { label: "High", value: "high" },
          { label: "Medium", value: "medium" },
          { label: "Low", value: "low" },
        ]
      }),
      name: text(),
      description: text(),
      status: select({
        type: "enum",
        options: [
          { label: "Backlog", value: "backlog" },
          { label: "In development", value: "in_development" },
          { label: "In testing", value: "in_testing" },
          { label: "In approval", value: "in_approval" },
          { label: "Done", value: "done" },
        ],
        defaultValue: 'backlog'
      }),
      parentTask: relationship({ ref: 'Task' })
    }
  })

};
