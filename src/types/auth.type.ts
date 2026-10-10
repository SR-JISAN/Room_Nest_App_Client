import type { IUpdateProfile } from "./user.type";

export interface IUserLogin {
  email: string;
  password: string;
}
export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
}

export interface IEmailVerification {
  email: string;
  otp: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "LANDLORD";
  imageURL?: string | null;
  emailVerified: boolean;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  profiles: IUpdateProfile;
}

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
