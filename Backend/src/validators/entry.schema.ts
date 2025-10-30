import { z } from "zod";

export const EntrySchema = z.object({
  title: z.string().min(1),
  type: z.enum(["Movie", "TV_Show"]),
  director: z.string().min(1),
  duration: z.string().min(1),
  yearOrTime: z.string().min(1),
  genre: z.string().optional(),
  cast: z.string().optional(),
  budget: z.string().optional(),
  boxOffice: z.string().optional(),
  language: z.string().optional(),
  country: z.string().optional(),
  location: z.string().optional(),
  rating: z.number().optional(),
  posterUrl: z.string().url().optional(),
  description: z.string().optional(),
});

export type EntryInput = z.infer<typeof EntrySchema>;
