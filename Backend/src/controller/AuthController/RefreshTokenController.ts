import type { Request, Response, NextFunction } from "express";
import { STATUSCODES } from "../../constants/StatusCodes";
import { ERROR_MESSAGES } from "../../constants/ResponseMessages";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../../config/jwt";
import { prisma } from "../../prisma/client";

export const RefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(STATUSCODES.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded?.userId) {
      return res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.NO_TOKEN_PAYLOAD });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res
        .status(STATUSCODES.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(STATUSCODES.OK).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
