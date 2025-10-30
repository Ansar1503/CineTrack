import type { Request, Response, NextFunction } from "express";
import { STATUSCODES } from "../../constants/StatusCodes";
import { SUCCESS_MESSAGES } from "../../constants/ResponseMessages";

export const logoutUser = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(STATUSCODES.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_LOGOUT,
    });
  } catch (error) {
    next(error);
  }
};
