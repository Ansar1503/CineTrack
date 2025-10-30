import type { Response, NextFunction } from "express";
import { EntrySchema } from "../../validators/entry.schema";
import { prisma } from "../../prisma/client";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../constants/ResponseMessages";
import { STATUSCODES } from "../../constants/StatusCodes";

export const createEntry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res
        .status(STATUSCODES.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    const data = EntrySchema.parse(req.body);

    const entry = await prisma.entry.create({
      data: {
        ...data,
        userId: req.userId!,
        genre: data.genre ?? null,
        cast: data.cast ?? null,
        budget: data.budget ?? null,
        boxOffice: data.boxOffice ?? null,
        language: data.language ?? null,
        country: data.country ?? null,
        location: data.location ?? null,
        rating: data.rating ?? null,
        posterUrl: data.posterUrl ?? null,
        description: data.description ?? null,
      },
    });

    return res.status(STATUSCODES.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.ENTRY_CREATED,
      entry,
    });
  } catch (err) {
    next(err);
  }
};
