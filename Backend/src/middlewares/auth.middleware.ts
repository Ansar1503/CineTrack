import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/ResponseMessages";
import { STATUSCODES } from "../constants/StatusCodes";
import { verifyAccessToken } from "../config/jwt";
import { prisma } from "@src/prisma/client";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
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
    if (!decoded.userId) {
      return res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.NO_TOKEN_PAYLOAD });
    }
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!userExists) {
      return res.status(STATUSCODES.BAD_REQUEST).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(STATUSCODES.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
  }
};
