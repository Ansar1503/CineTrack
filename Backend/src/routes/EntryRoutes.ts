import { Router } from "express";
import { ROUTES } from "../constants/RouteConstants";
import { createEntry } from "@src/controller/EntryController/CreateEntryController";
import { authMiddleware } from "@src/middlewares/auth.middleware";

const route = Router();

route.post(ROUTES.ENTRY.CREATE, authMiddleware, createEntry);

export default route;
