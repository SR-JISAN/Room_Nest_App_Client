"use client"
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {useForm} from "@tanstack/react-form";
import {loginValidation} from "@/validations"
import {  useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin, useLogin } from "@/hooks";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { GoogleLogin } from "@react-oauth/google";
import GoogleLoginComponents from "../layout/google/GoogleLoginComponents";


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const route = useRouter();
    const [showPass, setShowPass] = useState(false);

    
    const {mutate: login,isPending: loginPending}=useLogin();

    const form = useForm({
      defaultValues: {
        email: "test.admin@gmail.com",
        password: "Admin@12",
      },
      validators: {
        onSubmit: loginValidation,
      },
      onSubmit: ({ value }) => {
        const loginData = {
          email: value.email,
          password: value.password,
        };
        login(loginData, {
          onSuccess: (res) => {
            toast.add({
              title: "Welcome Back to Room Nest",
              description: `${res.message ? res.message :"You LogIn Successfully"}`,
              type:"success"
            });
            form.reset();
            route.push("/")
          },
          onError: (err) => {
            toast.add({
              title: "Welcome Back to Room Nest",
              description: `${err.message ? err.message : "Something is wrong. Please try again."}`,
              type: "error",
            });
          },
        });
      },
    });

    


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              return form.handleSubmit();
            }}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Room Nest account
                </p>
              </div>

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        name={field.name}
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoComplete="off"
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        id={field.name}
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <Field>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex items-center ">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Link
                            href="/forget-password"
                            className="ml-auto text-sm underline-offset-2 hover:underline hover:text-blue-700"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            name={field.name}
                            onChange={(e) => field.handleChange(e.target.value)}
                            autoComplete="off"
                            onBlur={field.handleBlur}
                            value={field.state.value}
                            id="password"
                            type={showPass ? "text" : "password"}
                            required
                          />
                          <button
                            onClick={() => setShowPass((prev) => !prev)}
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                          >
                            {showPass ? <EyeClosed /> : <Eye />}
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </Field>
              <Field>
                <Button
                  disabled={loginPending}
                  className="bg-[#1a3929] cursor-pointer"
                  type="submit"
                >
                  {loginPending ? (
                    <>
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <GoogleLoginComponents/>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link className="text-blue-700" href="/register">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login.png"
              alt="Image"
              width={500}
              height={500}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
