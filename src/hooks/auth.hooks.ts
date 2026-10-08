
import {  userGoogleLogin, userLoggedOut, userLogin, userProfile, userRegistration } from "@/api"
import { useMutation, useQuery } from "@tanstack/react-query"


export function useLogin(){
    return useMutation({
        mutationFn: userLogin,
    });
};

export function useGoogleLogin() {
  return useMutation({
    mutationFn: userGoogleLogin,
  });
}

export function useRegistration(){
    return useMutation({
        mutationFn: userRegistration,
    });
};

export function useLoggedOut(){
    return useMutation({
        mutationFn: userLoggedOut,
    });
};
export function useUserProfile(){
    return useQuery({
        queryKey:["user"],
        queryFn: userProfile,
        retry:false
    });
};