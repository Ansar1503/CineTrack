import type { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcryptjs";
import { prisma } from "../../prisma/client";
import { UserLoginSchema } from "../../validators/user.schema";
import { signAccessToken, signRefreshToken } from "../../config/jwt";
import { STATUSCODES } from "../../constants/StatusCodes";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../constants/ResponseMessages";

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = UserLoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res
        .status(STATUSCODES.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INVALID_PASSWORD });
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
      message: SUCCESS_MESSAGES.USER_LOGGED_IN,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
