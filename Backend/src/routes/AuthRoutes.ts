import { Router } from "express";
import { ROUTES } from "../constants/RouteConstants";

const route = Router();

route.post(ROUTES.AUTH.REGISTER);

export default route;
