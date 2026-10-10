import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  emailVerification,
  updatePassword,
  userGoogleLogin,
  userLoggedOut,
  userLogin,
  userProfile,
  userRegistration,
} from "@/api";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userGoogleLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: emailVerification,
  });
}

export function useLoggedOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLoggedOut,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.cancelQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["dashboard"] });
      queryClient.removeQueries({ queryKey: ["booking"] });
      queryClient.removeQueries({ queryKey: ["payments"] });
      queryClient.removeQueries({ queryKey: ["my-properties"] });
    },
  });
}
export function useUserProfile() {
  return useQuery({
    queryKey: ["user"],
    queryFn: userProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};
