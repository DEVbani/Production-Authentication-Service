import { persmission } from "./permission.js";

export const rolePermission = {
  USER: [persmission.VIEW_PROFILE, persmission.EDIT_PROFILE],
  ADMIN: [
    persmission.CREATE_USER,
    persmission.DELETE_USER,
    persmission.EDIT_USER,
    persmission.VIEW_USER,
  ],
};
