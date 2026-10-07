import apiClient from "@/lib/ofetch"
import { IUserLogin, IUserRegistration } from "@/types/auth.type";




export const userLogin = (payload: IUserLogin) => {
  return apiClient("/api/auth/login", { method: "POST", body: payload });
};

export const userRegistration = (payload: IUserRegistration) => {
  return apiClient("/api/auth/register", { method: "POST", body: payload });
};