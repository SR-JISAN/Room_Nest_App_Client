import apiClient from "@/lib/ofetch";
import { IUpdateProfile } from "@/types/user.type";

export const updateUserProfile = (payload: IUpdateProfile) => {
  return apiClient("/api/users/update-profile", {
    method: "patch",
    body: payload,
  });
};