import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/ResponseMessages";
import { STATUSCODES } from "../constants/StatusCodes";
import { verifyAccessToken } from "../config/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res
        .status(STATUSCODES.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED });

    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(STATUSCODES.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
  }
};
