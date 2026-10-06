import apiClient from "@/lib/ofetch"
import { IUserLogin } from "@/types/auth.type";




export const userLogin = (payload: IUserLogin) => {
  return apiClient("/api/auth/login", { method: "POST", body: payload });
};