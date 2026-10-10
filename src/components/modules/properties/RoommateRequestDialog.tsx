"use client";

import { useForm } from "@tanstack/react-form";
import { LoaderCircle, UserPlus, Users } from "lucide-react";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useUserProfile } from "@/hooks/auth.hooks";
import { useCreateSubRoomBooking } from "@/hooks/booking.hooks";
import type { Room } from "@/types/property.type";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.coerce
    .number()
    .int()
    .min(18, "Must be at least 18 years old")
    .max(100),
  gender: z.enum(["MALE", "FEMALE"]),
  occupantCount: z.coerce.number().int().min(1).max(5),
  startDate: z
    .string()
    .min(1, "Choose a move-in date")
    .refine(
      (d) => new Date(d) > new Date(),
      "Move-in date must be in the future",
    ),
  endDate: z.string().optional(),
  note: z.string().max(500).optional(),
});

export default function RoommateRequestDialog({
  room,
  open,
  onOpenChange,
}: {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: userData } = useUserProfile();
  const user = userData?.data;
  const createSubBooking = useCreateSubRoomBooking();
  const [formError, setFormError] = useState("");

  const minDate = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      age: 22,
      gender: "MALE" as "MALE" | "FEMALE",
      occupantCount: 1,
      startDate: "",
      endDate: "",
      note: "",
    },
    onSubmit: async ({ value }) => {
      setFormError("");
      const parsed = schema.safeParse(value);
      if (!parsed.success) {
        setFormError(
          parsed.error.issues[0]?.message ?? "Please review details.",
        );
        return;
      }

      try {
        await createSubBooking.mutateAsync({
          roomId: room.id,
          name: parsed.data.name,
          age: parsed.data.age,
          gender: parsed.data.gender,
          occupantCount: parsed.data.occupantCount,
          startDate: parsed.data.startDate,
          ...(parsed.data.endDate ? { endDate: parsed.data.endDate } : {}),
          ...(parsed.data.note ? { note: parsed.data.note } : {}),
        });

        toast.add({
          title: "Roommate Request Submitted",
          description:
            "Your application has been received. The resident will review your request.",
          type: "success",
        });
        onOpenChange(false);
      } catch (err: unknown) {
        const error = err as FetchError<{ message?: string }>;
        const msg =
          error.data?.message ??
          error.message ??
          "Could not submit roommate application.";
        setFormError(msg);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-white dark:bg-card dark:border-border p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
            <Users className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold text-foreground">
              Apply as a Roommate
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Apply to share {room.title || "this room"} with current residents.
            Rent: ৳
            {Number(room.subRentAmount ?? room.rentAmount).toLocaleString(
              "en-BD",
            )}{" "}
            / month.
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 p-3 text-xs">
            {formError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-3 space-y-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <div>
                  <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                    Full Name *
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your legal name"
                    className="mt-1 h-10 rounded-xl"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="age">
              {(field) => (
                <div>
                  <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                    Age *
                  </label>
                  <Input
                    type="number"
                    min={18}
                    max={100}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="mt-1 h-10 rounded-xl"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <form.Field name="gender">
              {(field) => (
                <div>
                  <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                    Gender *
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      if (val) field.handleChange(val as "MALE" | "FEMALE");
                    }}
                  >
                    <SelectTrigger className="mt-1 h-10 rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="occupantCount">
              {(field) => (
                <div>
                  <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                    Number of Applicants *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={Math.max(
                      1,
                      (room.maxRoommates ?? 2) - (room.currentRoommates ?? 0),
                    )}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="mt-1 h-10 rounded-xl"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <form.Field name="startDate">
              {(field) => (
                <div>
                  <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                    Move-in Date *
                  </label>
                  <Input
                    type="date"
                    min={minDate}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 h-10 rounded-xl"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="endDate">
              {(field) => (
                <div>
                  <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                    Move-out Date (Optional)
                  </label>
                  <Input
                    type="date"
                    min={minDate}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 h-10 rounded-xl"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="note">
            {(field) => (
              <div>
                <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                  Introduction / Notes for Roommates
                </label>
                <textarea
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Introduce yourself, your daily routine, or profession..."
                  className="mt-1 w-full rounded-xl border border-[#d6dfd7] dark:border-border bg-white dark:bg-muted/30 dark:text-foreground p-2.5 text-xs outline-none focus:border-emerald-700"
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSubBooking.isPending}
              className="rounded-xl bg-[#173b28] hover:bg-[#245638] dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              {createSubBooking.isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
