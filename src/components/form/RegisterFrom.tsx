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
import { RegisterValidation} from "@/validations"
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const form = useForm({
        defaultValues:{
            name:"",
            email:"",
            password:""
        },
        validators:{
            onSubmit:RegisterValidation
        }
        ,
        onSubmit:({value})=>{
             console.log(value)
             form.reset()
        }
    });

    const [showPass , setShowPass]=useState(false);

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
                            className="ml-auto text-sm underline-offset-2 hover:underline hover:text-blue-700"
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
                <Button className="bg-[#1a3929] cursor-pointer" type="submit">
                  Register
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <Button
                  className="hover:bg-[#1c392a] hover:text-white cursor-pointer"
                  variant="outline"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="">Login with Google</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link className="text-blue-700" href="/login">
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
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
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
