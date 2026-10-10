"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useBookings, useRejectBooking } from "@/hooks/booking.hooks";

const label = (value?: string) =>
  value
    ? value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "—";

export default function LandlordBookingContent({
  admin = false,
}: {
  admin?: boolean;
}) {
  const bookingsQuery = useBookings();
  const reject = useRejectBooking();
  const [message, setMessage] = useState("");
  const bookings = bookingsQuery.data ?? [];

  async function rejectRequest(id: string) {
    if (
      !window.confirm(
        "Reject this pending booking request? The pending deposit checkout will be cancelled if it has not started.",
      )
    )
      return;
    setMessage("");
    try {
      await reject.mutateAsync(id);
      toast.add({ title: "Booking request rejected", type: "success" });
    } catch (error) {
      const body =
        error && typeof error === "object" && "data" in error
          ? error.data
          : null;
      const detail =
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : "Refresh and try again.";
      setMessage(detail);
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <header>
        <p className="text-sm font-medium text-emerald-800">
          {admin ? "Administration" : "Landlord workspace"}
        </p>
        <h1 className="mt-2 text-3xl font-bold">Booking requests</h1>
        <p className="mt-2 text-muted-foreground">
          A paid deposit confirms a booking automatically. You can reject an
          unpaid request while no payment checkout is active.
        </p>
      </header>
      {bookingsQuery.isPending && (
        <div className="space-y-3">
          {[1, 2, 3].map((id) => (
            <Skeleton key={id} className="h-28 rounded-xl" />
          ))}
        </div>
      )}
      {bookingsQuery.isError && (
        <Card>
          <CardContent className="py-8 text-center">
            <p>Could not load booking requests.</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => void bookingsQuery.refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )}
      {!bookingsQuery.isPending &&
        !bookingsQuery.isError &&
        bookings.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No booking requests for your properties.
            </CardContent>
          </Card>
        )}
      {message && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {message}
        </p>
      )}
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking.id} className="rounded-xl">
            <CardContent className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
              <div>
                <h2 className="font-semibold">
                  {booking.room?.property?.title ?? "Property"} ·{" "}
                  {booking.room?.title ?? "Room"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Request from {booking.user?.name ?? "Room Nest user"} ·{" "}
                  {booking.room?.property?.city ?? "Location not listed"}
                </p>
                <p className="mt-2 text-sm">
                  Status: <strong>{label(booking.status)}</strong> · Start:{" "}
                  {new Date(booking.startDate).toLocaleDateString("en-BD")} ·
                  Occupants: {booking.occupantCount}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly rent ৳
                  {Number(booking.rentAmount).toLocaleString("en-BD")} · Deposit
                  ৳{Number(booking.securityDeposit).toLocaleString("en-BD")}
                </p>
                {booking.payments?.map((payment) => (
                  <p
                    key={payment.id}
                    className="mt-1 text-xs text-muted-foreground"
                  >
                    {label(payment.paymentType)} payment:{" "}
                    {label(payment.paymentStatus)}
                  </p>
                ))}
              </div>
              {booking.status === "PENDING" && (
                <Button
                  variant="outline"
                  disabled={reject.isPending}
                  onClick={() => void rejectRequest(booking.id)}
                >
                  Reject request
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
