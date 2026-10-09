import { updateUserProfile } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useProfileUpdate(){
   const queryClient = useQueryClient();

   return useMutation({
     mutationFn: updateUserProfile,

     onSuccess: async () => {
       await queryClient.invalidateQueries({
         queryKey: ["user"],
       });
     },
   });
};