import AppError from "../errors/AppError.js";
import { rolePermission } from "../rolePermission.js";
export function authorize(persmission) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!rolePermission[userRole]?.includes(persmission)) {
      throw new AppError("Forbidden", 403);
    }
    next();
  };
}
