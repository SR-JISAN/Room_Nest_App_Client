"use client";

import { useForm } from "@tanstack/react-form";
import {
  CalendarDays,
  CircleAlert,
  CreditCard,
  Home,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateBooking,
  useInitiateBookingPayment,
} from "@/hooks/booking.hooks";
import { usePropertyDetails } from "@/hooks/property.hooks";

const bookingSchema = z
  .object({
    occupantCount: z.number().int().min(1).max(5),
    startDate: z
      .string()
      .min(1, "Choose a move-in date")
      .refine(
        (value) => new Date(value) > new Date(),
        "Move-in date must be in the future",
      ),
    endDate: z.string().optional(),
    note: z.string().max(500),
  })
  .refine(
    (value) =>
      !value.endDate ||
      !value.startDate ||
      new Date(value.endDate) > new Date(value.startDate),
    { message: "Move-out date must be after move-in date", path: ["endDate"] },
  );

const money = (value?: number | string) =>
  `৳${Number(value ?? 0).toLocaleString("en-BD")}`;
const errorText = (error: unknown) => {
  const fetchError = error as FetchError<{ message?: string }>;
  return fetchError.data?.message ?? fetchError.message ?? "Please try again.";
};

export default function BookingCreateContent() {
  const params = useSearchParams();
  const propertyId = params.get("propertyId") ?? "";
  const roomId = params.get("roomId") ?? "";
  const { data: property, isPending, isError } = usePropertyDetails(propertyId);
  const create = useCreateBooking();
  const pay = useInitiateBookingPayment();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState("");
  const room = property?.rooms?.find((item) => item.id === roomId);
  const minimumDate = new Date(Date.now() + 86_400_000)
    .toISOString()
    .slice(0, 10);

  const form = useForm({
    defaultValues: { occupantCount: 1, startDate: "", endDate: "", note: "" },
    onSubmit: async ({ value }) => {
      setRequestError("");
      const parsed = bookingSchema.safeParse(value);
      if (!parsed.success) {
        setRequestError(
          parsed.error.issues[0]?.message ?? "Check the booking details.",
        );
        return;
      }
      try {
        const booking = await create.mutateAsync({
          roomId,
          occupantCount: parsed.data.occupantCount,
          startDate: parsed.data.startDate,
          ...(parsed.data.endDate ? { endDate: parsed.data.endDate } : {}),
          ...(parsed.data.note ? { note: parsed.data.note } : {}),
        });
        setBookingId(booking.id);
      } catch (error) {
        setRequestError(errorText(error));
      }
    },
  });

  const beginPayment = async () => {
    if (!bookingId) return;
    setRequestError("");
    try {
      const result = await pay.mutateAsync(bookingId);
      if (!result.bkashURL)
        throw new Error("The payment provider did not return a checkout URL.");
      window.location.assign(result.bkashURL);
    } catch (error) {
      setRequestError(errorText(error));
    }
  };

  if (!propertyId || !roomId) {
    return (
      <BookingState
        title="Room details are missing"
        description="Choose a room from a property page before starting a booking."
      />
    );
  }
  if (isPending)
    return (
      <BookingState
        title="Loading room details"
        description="Fetching the current room and rent information."
        loading
      />
    );
  if (isError || !property || !room) {
    return (
      <BookingState
        title="Room unavailable"
        description="We could not load this room. It may have been removed or the link may be invalid."
      />
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f9f6] px-4 py-10 text-[#172b20] sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-2xl border-[#e0e8df]">
          <CardHeader>
            <CardTitle>Request this room</CardTitle>
            <CardDescription>
              Confirm your dates and occupant count. The backend validates room
              details and calculates the deposit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookingId ? (
              <div className="space-y-5">
                <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">
                  Your booking request was created. Continue to bKash to pay the
                  security deposit. The booking is not confirmed until the
                  backend updates its status.
                </div>
                <Button
                  onClick={() => void beginPayment()}
                  disabled={pay.isPending}
                  className="w-full bg-[#173b28]"
                >
                  {pay.isPending ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  Continue to bKash
                </Button>
                <Link
                  href="/dashboard/my-bookings"
                  className="block text-center text-sm font-semibold text-[#173b28] underline"
                >
                  View my bookings
                </Link>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void form.handleSubmit();
                }}
                className="space-y-5"
              >
                <form.Field name="occupantCount">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Number of occupants</Label>
                      <Input
                        id={field.name}
                        type="number"
                        min={1}
                        max={5}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="startDate">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Move-in date</Label>
                      <Input
                        id={field.name}
                        type="date"
                        min={minimumDate}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        required
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="endDate">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Move-out date{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id={field.name}
                        type="date"
                        min={minimumDate}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="note">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Note to the landlord{" "}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <textarea
                        id={field.name}
                        maxLength={500}
                        rows={4}
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  )}
                </form.Field>
                {requestError && (
                  <p role="alert" className="flex gap-2 text-sm text-red-700">
                    <CircleAlert className="h-4 w-4 shrink-0" />
                    {requestError}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={create.isPending}
                  className="w-full bg-[#173b28]"
                >
                  {create.isPending && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create booking request
                </Button>
              </form>
            )}
            {requestError && bookingId && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {requestError}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit rounded-2xl border-[#e0e8df]">
          <CardHeader>
            <CardTitle className="text-lg">Booking summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Home className="h-5 w-5 text-emerald-800" />
              <div>
                <p className="font-semibold">{property.title}</p>
                <p className="text-muted-foreground">
                  {room.title} · {property.city}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span>Monthly rent</span>
              <strong>{money(room.rentAmount)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Security deposit</span>
              <strong>{money(room.securityDeposit)}</strong>
            </div>
            <p className="flex gap-2 rounded-lg bg-muted/50 p-3 text-xs leading-5 text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" />
              The booking service determines the final amount.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function BookingState({
  title,
  description,
  loading = false,
}: {
  title: string;
  description: string;
  loading?: boolean;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        {loading ? (
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-800" />
        ) : (
          <CircleAlert className="mx-auto h-8 w-8 text-amber-700" />
        )}
        <h1 className="mt-4 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <Link
          href="/properties"
          className="mt-5 inline-block font-semibold text-[#173b28] underline"
        >
          Browse properties
        </Link>
      </div>
    </main>
  );
}
