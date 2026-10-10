import type { IUser } from "@/types/auth.type";

export function homeForRole(role: IUser["role"]): string {
  if (role === "ADMIN") return "/admin";
  if (role === "LANDLORD") return "/landlord";
  return "/user";
}
