"use client";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
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
import { useRegistration } from "@/hooks";
import { RegisterValidation } from "@/validations";
import GoogleLoginComponents from "../layout/google/GoogleLoginComponents";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const route = useRouter();
  const [showPass, setShowPass] = useState(false);

  const { mutate: register, isPending } = useRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: RegisterValidation,
    },
    onSubmit: ({ value }) => {
      const registerData = {
        name: value.name,
        email: value.email,
        password: value.password,
      };
      register(registerData, {
        onSuccess: (_res) => {
          toast.add({
            title: "Welcome to Room Nest",
            description:
              "An OTP sent your email. Verify your email to complete registration",
            type: "success",
          });
          const params = new URLSearchParams({ email: value.email });
          route.push(`/verify-email?${params.toString()}`);
          form.reset();
        },
        onError: (err) => {
          const error = err as FetchError<{ message?: string }>;
          toast.add({
            title: "Registration failed",
            description:
              error.data?.message ||
              error.message ||
              "Could not complete registration. Please try again.",
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
                <h1 className="text-2xl font-bold">Welcome to Room Nest</h1>
                <p className="text-balance text-muted-foreground">
                  Create an account to get started
                </p>
              </div>

              <Field>
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Your Full Name
                        </FieldLabel>
                        <Input
                          name={field.name}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete="off"
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          id={field.name}
                          type="text"
                          required
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </Field>
              <Field>
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
              </Field>
              <Field>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                          >
                            Forgot your password?
                          </a>
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                          >
                            {showPass ? (
                              <EyeClosed className="text-green-600" />
                            ) : (
                              <Eye className="text-green-600"/>
                            )}
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
                  disabled={isPending}
                  className="bg-[#1a3929] hover:bg-[#142e21] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white cursor-pointer"
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <GoogleLoginComponents />
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  className="text-emerald-700 hover:underline dark:text-emerald-400 font-medium"
                  href="/login"
                >
                  Sign In
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/registerImage.png"
              alt="Image"
              width={500}
              height={500}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-90 dark:opacity-90"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
