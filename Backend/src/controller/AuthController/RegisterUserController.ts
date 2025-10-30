import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/client";
import { UserRegisterSchema } from "../../validators/user.schema";
import { signAccessToken, signRefreshToken } from "../../config/jwt";
import { STATUSCODES } from "../../constants/StatusCodes";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../constants/ResponseMessages";

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = UserRegisterSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res
        .status(STATUSCODES.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(STATUSCODES.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
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
