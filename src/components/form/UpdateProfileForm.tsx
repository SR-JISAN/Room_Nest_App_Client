"use client";

import { useForm } from "@tanstack/react-form";
import {
  Camera,
  UserRound,
  Phone,
  CalendarDays,
  BriefcaseBusiness,
  MapPin,
  FileText,
  LoaderCircle,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserProfile } from "@/hooks";
import { useProfileUpdate } from "@/hooks/user.hooks";
import type { IUpdateProfile } from "@/types/user.type";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { useQueryClient } from "@tanstack/react-query";

const inputClass = "mt-2 h-11 w-full min-w-0 rounded-xl";
type UpdateProfileFormProps = {
  onClose?: () => void;
};
export default function UpdateProfileForm({ onClose }: UpdateProfileFormProps) {
  const { data, isLoading, isError } = useUserProfile();
  const { mutate: updateProfile, isPending } = useProfileUpdate();
  const queryClient = useQueryClient();
  const user = data?.data;
  const profilePicture = data?.data.imageURL;
  const route = useRouter();

  const form = useForm({
    defaultValues: {
      contactNumber: "",
      dateOfBirth: "",
      occupation: "",
      address: "",
      bio: "",
    },
    onSubmit: ({ value }) => {
      const updateProfileData = {
        contactNumber: value.contactNumber,
        dateOfBirth: value.dateOfBirth
          ? new Date(`${value.dateOfBirth}T00:00:00`)
          : undefined,
        occupation: value.occupation,
        address: value.address,
        bio: value.bio,
      };
      updateProfile(updateProfileData, {
        onSuccess: (res) => {
           queryClient.invalidateQueries({
            queryKey: ["user"],
          });
          toast.add({
            title: "Profile Update Successfully",
            description: "Your Profile Updated.",
            type: "success",
          });

          onClose?.();
          form.reset();
        },
        onError: (err) => {
          toast.add({
            title: "Profile Update failed",
            description: "Something went wrong. Please try again.",
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
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="flex min-h-80 w-full items-center justify-center px-4">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <UserCircle className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Unable to load your profile. Please try again.
          </p>
        </div>
      </section>
    );
  }

  const displayName =
    user.name ?? user.name ?? user.email?.split("@")[0] ?? "User";

  return (
    <section className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
      {/* Page heading */}
      <header className="mb-6 space-y-2 sm:mb-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-emerald-700 dark:text-emerald-400 sm:text-sm">
          ACCOUNT SETTINGS
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Update your profile
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Manage your personal information and profile picture.
        </p>
      </header>
      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-2 items-start gap-5">
        <aside className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm sm:p-6 lg:top-6">
          <div className="flex min-w-0 flex-col items-center text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left lg:flex-col lg:items-center lg:text-center">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted sm:size-20 lg:size-28">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={`${displayName}'s profile`}
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-10 text-muted-foreground lg:size-12" />
              )}
            </div>

            <div className="mt-4 min-w-0 w-full sm:mt-0 sm:flex-1 lg:mt-4 lg:w-full lg:flex-none">
              <h2 className="wrap-break-word text-base font-semibold sm:text-lg">
                {displayName}
              </h2>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {user.email}
              </p>

              {/* <div className="mt-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl sm:w-auto lg:w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 size-4" />
                  Upload photo
                </Button>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Choose an image from your device. Maximum size: 5 MB.
                </p>

                {selectedImage && (
                  <p className="mt-2 break-all text-xs text-emerald-700 dark:text-emerald-400">
                    Selected: {selectedImage.name}
                  </p>
                )}

                {imageError && (
                  <p
                    role="alert"
                    className="mt-2 wrap-break-word text-sm text-destructive"
                  >
                    {imageError}
                  </p>
                )}
              </div> */}
            </div>
          </div>
        </aside>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            return form.handleSubmit();
          }}
          className="min-w-0 w-full space-y-5 sm:space-y-6"
        >
          <div className="min-w-0 rounded-2xl border bg-card p-4 shadow-sm sm:p-6 lg:p-7">
            <div className="mb-5 space-y-1 sm:mb-6">
              <h2 className="text-lg font-semibold sm:text-xl">
                Personal information
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                Update your contact details and personal information.
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {/* Contact number */}
              <form.Field
                name="contactNumber"
                validators={{
                  onChange: ({ value }) =>
                    value.trim() && !/^[+()\d\s-]{7,20}$/.test(value.trim())
                      ? "Please enter a valid contact number."
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Phone className="size-4 shrink-0 text-muted-foreground" />
                      Contact number
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter contact number"
                      className={inputClass}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={field.state.meta.errors.length > 0}
                    />

                    {field.state.meta.errors.map((error, index) => (
                      <p
                        key={index}
                        className="mt-1 wrap-break-word text-xs text-destructive"
                      >
                        {String(error)}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              {/* Date of birth */}
              <form.Field name="dateOfBirth">
                {(field) => (
                  <div className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                      Date of birth
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      max={new Date().toLocaleDateString("en-CA")}
                      className={inputClass}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </div>
                )}
              </form.Field>

              {/* Occupation */}
              <form.Field name="occupation">
                {(field) => (
                  <div className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <BriefcaseBusiness className="size-4 shrink-0 text-muted-foreground" />
                      Occupation
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Software Developer"
                      className={inputClass}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </div>
                )}
              </form.Field>

              {/* Address */}
              <form.Field name="address">
                {(field) => (
                  <div className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <MapPin className="size-4 shrink-0 text-muted-foreground" />
                      Address
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      autoComplete="street-address"
                      placeholder="Enter your address"
                      className={inputClass}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Bio */}
            <div className="mt-5 min-w-0 sm:mt-6">
              <form.Field
                name="bio"
                validators={{
                  onChange: ({ value }) =>
                    value.length > 300
                      ? "Bio cannot exceed 300 characters."
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="min-w-0">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      About you
                    </label>

                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      maxLength={300}
                      placeholder="Write a short introduction about yourself..."
                      className="mt-2 min-h-28 w-full min-w-0 resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={field.state.meta.errors.length > 0}
                    />

                    <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                      <p className="text-xs leading-5 text-muted-foreground">
                        Introduce yourself in a few words.
                      </p>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {field.state.value.length}/300
                      </span>
                    </div>

                    {field.state.meta.errors.map((error, index) => (
                      <p
                        key={index}
                        className="mt-1 wrap-break-word text-xs text-destructive"
                      >
                        {String(error)}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>
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
