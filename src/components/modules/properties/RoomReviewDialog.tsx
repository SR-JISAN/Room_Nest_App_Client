"use client";

import { useForm } from "@tanstack/react-form";
import { LoaderCircle, Star } from "lucide-react";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { z } from "zod";
import type { ReviewRating } from "@/api/review.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { useAddReview } from "@/hooks/review.hooks";
import type { Room } from "@/types/property.type";

const ratingMap: Record<number, ReviewRating> = {
  1: "ONE",
  2: "TWO",
  3: "THREE",
  4: "FOUR",
  5: "FIVE",
};

const schema = z.object({
  rating: z.number().min(1).max(5),
  note: z
    .string()
    .trim()
    .min(5, "Review note must be at least 5 characters")
    .max(300, "Maximum 300 characters"),
});

export default function RoomReviewDialog({
  room,
  open,
  onOpenChange,
}: {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addReview = useAddReview();
  const [errorMessage, setErrorMessage] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const form = useForm({
    defaultValues: {
      rating: 5,
      note: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMessage("");
      const parsed = schema.safeParse(value);
      if (!parsed.success) {
        setErrorMessage(
          parsed.error.issues[0]?.message ?? "Please check review fields.",
        );
        return;
      }

      try {
        await addReview.mutateAsync({
          roomId: room.id,
          payload: {
            reviewRating: ratingMap[parsed.data.rating],
            note: parsed.data.note,
          },
        });

        toast.add({
          title: "Review Submitted",
          description:
            "Thank you for sharing your experience with the community!",
          type: "success",
        });
        onOpenChange(false);
      } catch (err: unknown) {
        const error = err as FetchError<{ message?: string }>;
        const msg =
          error.data?.message ??
          error.message ??
          "You must have stayed in this room to leave a review.";
        setErrorMessage(msg);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-white dark:bg-card dark:border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#14251b] dark:text-foreground">
            Review Room: {room.title || "Selected Room"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Share feedback about your stay. Note: Verified bookings or accepted
            roommate status is required by the backend to review.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 p-3 text-xs">
            {errorMessage}
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
          <form.Field name="rating">
            {(field) => (
              <div>
                <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                  Rating *
                </label>
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating ?? field.state.value) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => field.handleChange(star)}
                        className="rounded-md p-1 transition-transform hover:scale-110"
                        aria-label={`${star} star`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="note">
            {(field) => (
              <div>
                <label className="text-xs font-semibold text-[#2f4234] dark:text-card-foreground">
                  Your Experience *
                </label>
                <textarea
                  rows={4}
                  maxLength={300}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="How was the comfort, cleanliness, and living experience?"
                  className="mt-1 w-full rounded-xl border border-[#d6dfd7] dark:border-border bg-white dark:bg-muted/30 dark:text-foreground p-3 text-xs outline-none focus:border-emerald-700"
                />
                <div className="mt-1 text-right text-[11px] text-muted-foreground">
                  {field.state.value.length}/300
                </div>
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
              disabled={addReview.isPending}
              className="rounded-xl bg-[#173b28] hover:bg-[#245638] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white"
            >
              {addReview.isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Post Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
