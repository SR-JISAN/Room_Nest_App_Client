"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userProfile } from "@/api/auth.api";
import { toast } from "@/components/ui/toast";
import { useGoogleLogin } from "@/hooks";
import { homeForRole } from "@/lib/auth-routing";

const GoogleLoginComponents = () => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const { mutate: googleLogin } = useGoogleLogin();
  const handleGoogleLogin = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.add({
        title: "Google Login Failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: async () => {
          toast.add({
            title: "Google Login Successful",
            description: "You Logged In Successfully",
            type: "success",
          });
          try {
            const profile = await userProfile();
            queryClient.setQueryData(["user"], profile);
            route.replace(homeForRole(profile.data.role));
          } catch {
            route.replace("/");
          }
        },
        onError: (err) => {
          return toast.add({
            title: "Google Login Failed",
            description: `${err.message || "Something went wrong. Please try again."}`,
            type: "error",
          });
        },
      },
    );
  };
  return (
    <GoogleLogin
      text="continue_with"
      onSuccess={handleGoogleLogin}
      onError={() => {
        toast.add({
          title: "Google Login Failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      }}
    />
  );
};

export default GoogleLoginComponents;
