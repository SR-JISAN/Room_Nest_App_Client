import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage, updateUserProfile } from "@/api/user.api";

export function useProfileUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
}
