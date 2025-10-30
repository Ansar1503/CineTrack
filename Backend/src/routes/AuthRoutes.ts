import { Router } from "express";
import { ROUTES } from "../constants/RouteConstants";
import { RegisterUser } from "@src/controller/AuthController/RegisterUserController";

const route = Router();

route.post(ROUTES.AUTH.REGISTER, RegisterUser);

export default route;
