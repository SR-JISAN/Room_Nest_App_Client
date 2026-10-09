"use client";

import { useForm } from "@tanstack/react-form";
import {
  LoaderCircle,
  LockKeyhole,
  UserLock,
  ShieldLock,
  ReceiptEuroIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUpdatePassword, useUserProfile } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { UpdatePasswordValidation } from "@/validations";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { FetchError } from "ofetch";

const inputClass = "mt-2 h-11 w-full min-w-0 rounded-xl";

export default function UpdatePasswordForm() {
  const { isLoading } = useUserProfile();
  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: UpdatePasswordValidation,
    },
    onSubmit: ({ value }) => {
      const updatePasswordData = {
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        confirmPassword: value.confirmPassword,
      };

      updatePassword(updatePasswordData, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({
            queryKey: ["user"],
          });
          toast.add({
            title: "Password Update Successfully",
            description: "Your Password Updated.",
            type: "success",
          });

          form.reset();
        },
        onError: (err) => {
            const error = err as FetchError;
          toast.add({
            title: "Password Update failed",
            description: `${error.data.message} `,
            type: "error",
          });
        },
      });
    },
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-full min-w-0 px-3 py-4 sm:px-5 sm:py-6">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-center text-sm text-muted-foreground">
            Loading your Security Page...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      <div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            return form.handleSubmit();
          }}
          className="min-w-0 w-full space-y-5 sm:space-y-6"
        >
          <div className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm sm:p-6 lg:p-7">
              <form.Field name="currentPassword">
                {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="min-w-0">
                        <label
                          htmlFor={field.name}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />
                          Current Password
                        </label>

                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          autoComplete="tel"
                          placeholder="Enter Current Password"
                          className={inputClass}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={field.state.meta.errors.length > 0}
                        />

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                    
                }}
              </form.Field>

              <form.Field name="newPassword">
                {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                 return (
                   <Field data-invalid={isInvalid} className="min-w-0 my-5">
                     <label
                       htmlFor={field.name}
                       className="flex items-center gap-2 text-sm font-medium"
                     >
                       <ShieldLock className="size-4 shrink-0 text-muted-foreground" />
                       New Password
                     </label>

                     <Input
                       id={field.name}
                       name={field.name}
                       placeholder="New Password"
                       className={inputClass}
                       value={field.state.value}
                       onBlur={field.handleBlur}
                       onChange={(event) =>
                         field.handleChange(event.target.value)
                       }
                     />
                     {isInvalid && (
                     <FieldError errors={field.state.meta.errors} />
                   )}
                   </Field>
                 );
                }
                }
              </form.Field>

              <form.Field name="confirmPassword">
                
                {(field) =>{
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid; 
                  return <Field data-invalid={isInvalid} className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <UserLock className="size-4 shrink-0 text-muted-foreground" />
                      Confirm Password
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="Enter Your Confirm Password"
                      className={inputClass}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
               </Field>}
                }
              </form.Field>
            
          </div>

          {/* Submit button */}
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto sm:min-w-44"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
