import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { ERROR_MESSAGES } from "../constants/ResponseMessages";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const EMAIL_SECRET = process.env.JWT_EMAIL_SECRET as string;
const ACCESS_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"]) || "15m";
const REFRESH_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_REFRESH_EXPIRY as SignOptions["expiresIn"]) || "7d";

export const signAccessToken = (userId: string) => {
  if (!ACCESS_SECRET) {
    throw new Error(ERROR_MESSAGES.JWT_ACCESS_SECRET_NOT_FOUND);
  }
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

export const signRefreshToken = (userId: string) => {
  if (!REFRESH_SECRET) {
    throw new Error(ERROR_MESSAGES.JWT_REFRESH_SECRET_NOT_FOUND);
  }
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};

export const signEmailToken = (userId: string) => {
  if (!EMAIL_SECRET) {
    throw new Error(ERROR_MESSAGES.JWT_EMAIL_SECRET_NOT_FOUND);
  }
  return jwt.sign({ userId }, EMAIL_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

export const verifyAccessToken = (token: string) => {
  if (!ACCESS_SECRET) {
    throw new Error(ERROR_MESSAGES.JWT_ACCESS_SECRET_NOT_FOUND);
  }
  return jwt.verify(token, ACCESS_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
  if (!REFRESH_SECRET) {
    throw new Error(ERROR_MESSAGES.JWT_REFRESH_SECRET_NOT_FOUND);
  }
  return jwt.verify(token, REFRESH_SECRET) as { userId: string };
};

export const verifyEmailToken = (token: string) => {
  if (!EMAIL_SECRET) {
    throw new Error(ERROR_MESSAGES.JWT_EMAIL_SECRET_NOT_FOUND);
  }
  return jwt.verify(token, EMAIL_SECRET) as { userId: string };
};
