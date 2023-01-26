import { Lists } from ".keystone/types";
import { BaseKeystoneTypeInfo, KeystoneContext, KeystoneContextFromListTypeInfo } from "@keystone-6/core/types";

export const isAdmin = async (username: string, context: KeystoneContext<BaseKeystoneTypeInfo> ) => {
  const { isAdmin: isAdminField } = await context.query.User.findOne({
        where: {
          username
        },
        query: 'isAdmin'
      });
  return isAdminField;
}