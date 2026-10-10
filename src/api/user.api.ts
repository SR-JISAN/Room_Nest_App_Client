import apiClient from "@/lib/ofetch";
import type { IUpdateProfile } from "@/types/user.type";

export const updateUserProfile = (payload: IUpdateProfile) => {
  return apiClient("/api/users/update-profile", {
    method: "patch",
    body: payload,
  });
};

export const updateProfileImage = (file: File) => {
  const body = new FormData();
  body.append("profile_image", file);
  return apiClient<{ data: unknown }>("/api/users/update-profile-image", {
    method: "PATCH",
    body,
  });
};
