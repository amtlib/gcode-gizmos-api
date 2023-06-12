import { graphql, list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import slugify from 'slugify';
import { isAdmin } from "./helpers";

import {
    text,
    relationship,
    password,
    checkbox,
    file,
    image,
    timestamp,
    virtual,
    select,
    integer,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import type { Lists } from '.keystone/types';

export const lists: Lists = {
    Rating: list({
        fields: {
            user: relationship({ ref: "User.ratings" }),
            model: relationship({ ref: "Model.ratings" }),
            score: integer({ validation: { min: 1, max: 5 } })
        },
        access: {
            operation: {
                query: allowAll,
                update: allowAll,
                delete: allowAll,
                create: allowAll
            },
            item: {
                create: async ({ session }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    return true;
                },
                update: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.userId === user.id || await isAdmin(username, context));
                    return canEdit;
                },
                delete: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.userId === user.id || await isAdmin(username, context));
                    return canEdit;
                }
            }
        }
    }),
    ModelImage: list({
        fields: {
            model: relationship({ ref: 'Model.images' }),
            image: image({ storage: 'model_images' }),
            createdBy: relationship({
                ref: 'User.createdImages', ui: {
                    labelField: 'username'
                }
            }),
        },
        access: {
            operation: {
                query: allowAll,
                update: allowAll,
                delete: allowAll,
                create: allowAll
            },
            item: {
                create: async ({ session }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    return true;
                },
                update: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.createdById === user.id || await isAdmin(username, context));
                    return canEdit;
                },
                delete: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.createdById === user.id || await isAdmin(username, context));
                    return canEdit;
                }
            }
        }
    }),
    ModelFile: list({
        fields: {
            model: relationship({ ref: 'Model.files' }),
            file: file({ storage: 'model_files' }),
            createdBy: relationship({
                ref: 'User.createdFiles', ui: {
                    labelField: 'username'
                }
            }),
        },
        access: {
            operation: {
                query: allowAll,
                update: allowAll,
                delete: allowAll,
                create: allowAll
            },
            item: {
                create: async ({ session }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    return true;
                },
                update: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.createdById === user.id || await isAdmin(username, context));
                    return canEdit;
                },
                delete: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.createdById === user.id || await isAdmin(username, context));
                    return canEdit;
                }
            }
        }
    }),
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
            likedModels: relationship({ ref: 'Model.likedBy', many: true }),
            createdImages: relationship({ ref: 'ModelImage.createdBy', many: true }),
            createdFiles: relationship({ ref: 'ModelFile.createdBy', many: true }),
            comments: relationship({ ref: "Comment.author", many: true }),
            ratings: relationship({ ref: "Rating.user", many: true })
        },
        access: {
            operation: {
                query: allowAll,
                update: allowAll,
                delete: allowAll,
                create: allowAll
            },
            item: {
                create: allowAll,
                update: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.username === username || await isAdmin(username, context));
                    return canEdit;
                },
                delete: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.username === username || await isAdmin(username, context));
                    return canEdit;
                }
            }
        }
    }),
    Comment: list({
        fields: {
            model: relationship({ ref: "Model.comments" }),
            author: relationship({ ref: "User.comments" }),
            createdAt: timestamp({ defaultValue: { kind: 'now' } }),
            content: document({
                formatting: true,
                dividers: true,
                links: true,
                layouts: [
                    [1, 1],
                    [1, 1, 1],
                ],
            }),
        },
        access: {
            operation: {
                query: allowAll,
                update: allowAll,
                delete: allowAll,
                create: allowAll
            },
            item: {
                create: async ({ session }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    return true;
                },
                update: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.authorId === user.id || await isAdmin(username, context));
                    return canEdit;
                },
                delete: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.authorId === user.id || await isAdmin(username, context));
                    return canEdit;
                }
            }
        }
    }),
    Model: list({
        fields: {
            name: text({
                validation: { isRequired: true },
            }),
            description: document({
                formatting: true,
                dividers: true,
                links: true,
                layouts: [
                    [1, 1],
                    [1, 1, 1],
                ],
            }),
            images: relationship({ ref: "ModelImage.model", many: true }),
            files: relationship({ ref: "ModelFile.model", many: true }),
            createdAt: timestamp({ defaultValue: { kind: 'now' } }),
            createdBy: relationship({
                ref: 'User.createdModels', ui: {
                    labelField: 'username'
                }
            }),
            comments: relationship({ ref: "Comment.model", many: true }),
            likedBy: relationship({
                ref: 'User.likedModels', many: true, ui: {
                    labelField: "username",
                }
            }),
            doUserLikesIt: virtual({
                ui: {
                    itemView: { fieldMode: 'hidden' },
                    listView: { fieldMode: 'hidden' }
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
            userRating: virtual({
                ui: {
                    itemView: { fieldMode: 'hidden' },
                    listView: { fieldMode: 'hidden' }
                },
                field: graphql.field({
                    type: graphql.Float,
                    async resolve(item, args, context) {
                        if (context.session?.itemId) {
                            const userRating = await context.query.Model.findOne({ where: { id: item.id }, query: `ratings(where: {user: {id: {equals: "${context.session.itemId}"}}}) {score}` })
                            return userRating.ratings?.[0]?.score || 0;
                        }
                        return 0;
                    },

                }),
            }),
            ratingsAvg: virtual({
                ui: {
                    itemView: { fieldMode: 'hidden' },
                    listView: { fieldMode: 'hidden' }
                },
                field: graphql.field({
                    type: graphql.Float,
                    async resolve(item, args, context) {
                        const modelRatings = await context.query.Model.findOne({ where: { id: item.id }, query: `ratings {score} ratingsCount` })
                        return modelRatings.ratings.reduce((acc: number, curr: { score: number }) => curr.score + acc, 0) / (modelRatings.ratingsCount || 1)
                    },

                }),
            }),
            rate: virtual({
                ui: {
                    itemView: { fieldMode: 'hidden' },
                    listView: { fieldMode: 'hidden' }
                },
                field: graphql.field({
                    type: graphql.Boolean,
                    args: {
                        score: graphql.arg({ type: graphql.Int })
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
                    
                        const foundRate = await context.query.Rating.findMany({where: {user: {id: {equals: user.id}}, model: {id: {equals: item.id}}}});
                        if (foundRate[0]?.id) {
                            // update existing rate
                            await context.query.Rating.updateOne({ where: {id: foundRate[0].id}, data: { score: args.score}});
                            return true;
                        } else {
                            // create new rate
                            await context.query.Rating.createOne({ data: {user: {connect: {id: user.id}}, model: {connect: {id: item.id}}, score: args.score}})
                        }
                        return true;
                    }
                })
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
            recommendedInfill: integer({ validation: { min: 0, max: 100 } }),
            recommendedMaterial: select({
                options: [
                    { label: "PLA", value: "pla" },
                    { label: "ABS", value: "abs" },
                    { label: "PET", value: "pet" },
                    { label: "TPE", value: "tpe" },
                ]
            }),
            supports: select({
                options: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "Doesn't matter", value: "n/a" },
                ]
            }),
            ratings: relationship({ ref: "Rating.model", many: true })
        },
        hooks: {
            afterOperation: async ({ operation, item, context }) => {
                if (operation === "update" || operation === "delete") {
                    // delete files when no model is attached
                    const lonelyImages = await context.query.ModelImage.findMany({ where: { model: null } });
                    const lonelyFiles = await context.query.ModelFile.findMany({ where: { model: null } });
                    context.query.ModelImage.deleteMany({ where: [...lonelyImages.map(image => ({ id: image.id }))] });
                    context.query.ModelFile.deleteMany({ where: [...lonelyFiles.map(file => ({ id: file.id }))] });
                }
            }
        },
        access: {
            operation: {
                query: allowAll,
                update: allowAll,
                delete: allowAll,
                create: allowAll
            },
            item: {
                create: async ({ session }) => {
                    const username = session?.data.username as string;
                    if (!username) {
                        return false;
                    }
                    return true;
                },
                update: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.createdById === user.id || await isAdmin(username, context));
                    return canEdit;
                },
                delete: async ({ session, context, item }) => {
                    const username = session?.data.username as string;
                    const user = await context.query.User.findOne({
                        where: {
                            username
                        },
                        query: `id`
                    })
                    if (!username) {
                        return false;
                    }
                    const canEdit = await (item.createdById === user.id || await isAdmin(username, context));
                    return canEdit;
                }
            }
        }
    }),
};
