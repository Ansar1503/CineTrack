import { Router } from "express";
import { ROUTES } from "../constants/RouteConstants";
import { RegisterUser } from "@src/controller/AuthController/RegisterUserController";
import { LoginUser } from "@src/controller/AuthController/LoginUserController";
import { RefreshToken } from "@src/controller/AuthController/RefreshTokenController";

const route = Router();

route.post(ROUTES.AUTH.REGISTER, RegisterUser);
route.post(ROUTES.AUTH.LOGIN, LoginUser);
route.post(ROUTES.AUTH.REFRESH, RefreshToken);

export default route;
