import apiClient from "@/lib/ofetch"
import { IApiResponse, IEmailVerification, IUpdatePassword, IUser, IUserLogin, IUserRegistration } from "@/types/auth.type";




export const userLogin = (payload: IUserLogin) => {
  return apiClient("/api/auth/login", { method: "POST", body: payload });
};
export const userGoogleLogin = (payload:{idToken: string}) => {
  console.log("Google payload:", payload);
  return apiClient("/api/auth/google-login", {
    method: "POST",
    body:  payload
  });
};

export const userRegistration = (payload: IUserRegistration) => {
  return apiClient("/api/auth/register", { method: "POST", body: payload });
};
export const emailVerification = (payload: IEmailVerification) => {
  return apiClient("/api/auth/email-verify", { method: "POST", body: payload });
};
export const userProfile = () => {
  return apiClient<IApiResponse<IUser>>("/api/auth/my-profile");
};
export const userLoggedOut = () => {
  return apiClient("/api/auth/logout", { method: "POST" });
};

export const updatePassword = (payload: IUpdatePassword) => {
  return apiClient("/api/auth/update-password", {
    method: "PATCH",
    body:payload
  });
};