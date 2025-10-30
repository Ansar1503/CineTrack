import { Router } from "express";
import { ROUTES } from "../constants/RouteConstants";
import { RegisterUser } from "@src/controller/AuthController/RegisterUserController";
import { LoginUser } from "@src/controller/AuthController/LoginUserController";

const route = Router();

route.post(ROUTES.AUTH.REGISTER, RegisterUser);
route.post(ROUTES.AUTH.LOGIN, LoginUser);

export default route;
