"use client"

import { toast } from "@/components/ui/toast";
import { useGoogleLogin } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const GoogleLoginComponents = () => {
     const route = useRouter();
     const {mutate: googleLogin}= useGoogleLogin();
      const handleGoogleLogin = (credentialResponse :{credential?:string})=>{
           const idToken = credentialResponse.credential;
           if (!idToken) {
             toast.add({
               title: "Google Login Failed",
               description: "Something went wrong. Please try again.",
               type: "error",
             });
             return;
           };
     
           googleLogin({idToken},{
             onSuccess:()=>{
               toast.add({
                 title:"Google Login Successful",
                 description:"You Logged In Successfully",
                 type:"success"
               })
               route.push("/")
             },
             onError:(err)=>{
               return toast.add({
                 title: "Google Login Failed",
                 description: `${err.message || "Something went wrong. Please try again."}`,
                 type: "error",
               });
             }
           })
         }
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