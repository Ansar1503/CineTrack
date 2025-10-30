import axiosinstance from "@/api/axios";
import { ROUTES } from "@/constants/RouteConstants";
import { LoginForm, SignupForm } from "@/types/AuthTypes";



export const AuthService = {
  register: async (data: SignupForm) => {
    const res = await axiosinstance.post(
      `${ROUTES.AUTH.BASE}${ROUTES.AUTH.REGISTER}`,
      data
    );
    return res.data;
  },

  login: async (data: LoginForm) => {
    const res = await axiosinstance.post(
      `${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGIN}`,
      data
    );
    return res.data;
  },

  refresh: async () => {
    const res = await axiosinstance.post(
      `${ROUTES.AUTH.BASE}${ROUTES.AUTH.REFRESH}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  logout: async () => {
    const res = await axiosinstance.post(
      `${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGOUT}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },
};
