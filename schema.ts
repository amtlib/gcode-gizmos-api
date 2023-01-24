import { graphql, list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import slugify from 'slugify';
import { isAdmin, isLoggedIn } from "./helpers";

import {
    text,
    relationship,
    password,
    checkbox,
    file,
    image,
    timestamp,
    virtual,
    decimal,
    select,
} from '@keystone-6/core/fields';

import type { Lists } from '.keystone/types';

export const lists: Lists = {
    User: list({
        ui: {
            labelField: 'username'
        },
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
            likedModels: relationship({ ref: 'Model.likedBy', many: true })
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
            description: text({ validation: { isRequired: false } }),
            modelFile: file({ storage: 'model_files' }),
            modelImage: image({ storage: 'model_images' }),
            createdAt: timestamp({ defaultValue: { kind: 'now' } }),
            createdBy: relationship({
                ref: 'User.createdModels', ui: {
                    labelField: 'username'
                }
            }),
            likedBy: relationship({ ref: 'User.likedModels', many: true, ui: {
                labelField: "username",
            } }),
            doUserLikesIt: virtual({
                ui: {
                    itemView: {fieldMode: 'hidden'},
                    listView:  {fieldMode: 'hidden'}
                },
                field: graphql.field({
                    type: graphql.Boolean,
                    async resolve(item, args, context) {
                        if (context.session?.itemId) {
                            const user = await context.query.User.findOne({
                                where: {
                                    id: context.session.itemId
                                },
                                query: `likedModelsCount(where: {id: {equals: "${item.id}"}})`
                            })
                            return user.likedModelsCount > 0;
                        }

                        return false;
                    },

                }),
            }),
            slug: text({
                isIndexed: 'unique',
                hooks: {
                    resolveInput: ({ operation, resolvedData, inputData }) => {
                        if (operation === 'create' && inputData.name && !resolvedData.slug) {
                            return slugify(`${inputData.name}-${(Math.random() + 1).toString(36).substring(7)}`);
                        }

                        return resolvedData.slug;
                    },
                },
            }),
            recommendedInfill: decimal({validation: {min: "0", max: "100"}}),
            recommendedMaterial: select({ options: [
                {label: "PLA", value: "pla"},
                {label: "ABS", value: "abs"},
                {label: "PET", value: "pet"},
                {label: "TPE", value: "tpe"},
            ]}),
            supports: select({ options: [
                { label: "Yes", value: "yes"},
                { label: "No", value: "no"},
                { label: "Doesn't matter", value: "n/a"},
            ]}),
        },
        access: {
            operation: {
                create: async ({ session, context, listKey, operation }) => {
                    // return await isLoggedIn(session.data.email, context);
                    return true
                },
                query: allowAll,
                update: async ({ session, context, listKey, operation }) => {
                    return await isLoggedIn(session.data.email, context);
                },
                delete: async ({ session, context, listKey, operation }) => {
                    return await isLoggedIn(session.data.email, context);
                },
            }
        }
    })

};
