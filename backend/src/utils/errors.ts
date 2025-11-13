import createError from "http-errors";

export const UnauthorizedError = () => createError(401, "Unauthorized");
export const ForbiddenError = () => createError(403, "Forbidden");
export const NotFoundError = (msg = "Resource not found") => createError(404, msg);
export const BadRequestError = (msg = "Bad request") => createError(400, msg);
