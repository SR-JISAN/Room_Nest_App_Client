"use client";

import {
  CalendarDays,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { BookingRecord, SubBookingRecord } from "@/api/booking.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBookings,
  useCancelBooking,
  useCancelSubBooking,
  useDeleteSubBooking,
  useInitiateBookingPayment,
  useInitiateSubBookingPayment,
  useMySubBookings,
  useSubBookingRequests,
  useUpdateSubBooking,
} from "@/hooks/booking.hooks";

const money = (value?: number | string | null) =>
  `৳${Number(value ?? 0).toLocaleString("en-BD")}`;

const label = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function BookingHistoryContent() {
  const params = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "bookings" | "applications" | "requests"
  >("bookings");
  const [errorMessage, setErrorMessage] = useState("");

  const callbackStatus = params.get("status");

  // Bookings (Primary rooms)
  const {
    data: bookings,
    isPending: bookingsPending,
    isError: bookingsError,
    refetch: refetchBookings,
  } = useBookings();
  const bookingPayment = useInitiateBookingPayment();
  const bookingCancellation = useCancelBooking();

  // Sub-bookings (Roommate applications submitted by user)
  const {
    data: subBookings,
    isPending: subBookingsPending,
    isError: subBookingsError,
    refetch: refetchSubBookings,
  } = useMySubBookings();
  const subBookingPayment = useInitiateSubBookingPayment();
  const subBookingCancellation = useCancelSubBooking();
  const subBookingDeletion = useDeleteSubBooking();

  // Incoming Roommate Requests for user's booked rooms
  const {
    data: incomingGroups,
    isPending: requestsPending,
    refetch: refetchRequests,
  } = useSubBookingRequests();
  const updateSubRequest = useUpdateSubBooking();

  const totalIncomingRequests = useMemo(() => {
    if (!incomingGroups) return 0;
    return incomingGroups.reduce(
      (acc, group) => acc + (group.requests?.length ?? 0),
      0,
    );
  }, [incomingGroups]);

  const startBookingPayment = async (id: string) => {
    setErrorMessage("");
    try {
      const result = await bookingPayment.mutateAsync(id);
      if (!result.bkashURL) {
        throw new Error("No payment checkout URL was returned.");
      }
      window.location.assign(result.bkashURL);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Payment could not be started.",
      );
    }
  };

  const cancelBooking = async (id: string) => {
    if (
      !window.confirm("Cancel this booking request? This cannot be undone.")
    ) {
      return;
    }
    setErrorMessage("");
    try {
      await bookingCancellation.mutateAsync(id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The booking could not be cancelled.",
      );
    }
  };

  const startSubPayment = async (id: string) => {
    setErrorMessage("");
    try {
      const result = await subBookingPayment.mutateAsync(id);
      if (!result.bkashURL) {
        throw new Error("No payment checkout URL was returned.");
      }
      window.location.assign(result.bkashURL);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Payment could not be started.",
      );
    }
  };

  const cancelSub = async (id: string) => {
    if (
      !window.confirm(
        "Cancel this roommate application? This cannot be undone.",
      )
    ) {
      return;
    }
    setErrorMessage("");
    try {
      await subBookingCancellation.mutateAsync(id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The application could not be cancelled.",
      );
    }
  };

  const deleteSub = async (id: string) => {
    if (!window.confirm("Remove this application record?")) {
      return;
    }
    setErrorMessage("");
    try {
      await subBookingDeletion.mutateAsync(id);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The application could not be removed.",
      );
    }
  };

  const respondToRequest = async (
    subBookingId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    setErrorMessage("");
    try {
      await updateSubRequest.mutateAsync({ id: subBookingId, status });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update the roommate request status.",
      );
    }
  };

  return (
    <main className="min-h-[70vh] bg-[#f7f9f6] px-4 py-10 text-[#172b20] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              Your account
            </p>
            <h1 className="mt-2 text-3xl font-bold">My bookings & roommates</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your room bookings, roommate applications, and incoming
              roommate requests.
            </p>
          </div>
          <Link
            href="/properties"
            className="text-sm font-semibold text-[#173b28] underline hover:text-[#28563b]"
          >
            Browse properties
          </Link>
        </div>

        {callbackStatus && (
          <output className="mt-6 block rounded-xl border border-[#dce8dc] bg-white p-4 text-sm shadow-xs">
            Payment callback: <strong>{label(callbackStatus)}</strong>. Check
            the payment state below for the latest backend record.
          </output>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}

        {/* Tab switcher */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e2eae3] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "bookings"
                ? "bg-[#173b28] text-white shadow-xs"
                : "bg-white text-[#526859] hover:bg-[#ebf2ec]"
            }`}
          >
            Room Bookings {bookings ? `(${bookings.length})` : ""}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "applications"
                ? "bg-[#173b28] text-white shadow-xs"
                : "bg-white text-[#526859] hover:bg-[#ebf2ec]"
            }`}
          >
            Roommate Applications {subBookings ? `(${subBookings.length})` : ""}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "requests"
                ? "bg-[#173b28] text-white shadow-xs"
                : "bg-white text-[#526859] hover:bg-[#ebf2ec]"
            }`}
          >
            Incoming Requests{" "}
            {totalIncomingRequests > 0 ? `(${totalIncomingRequests})` : ""}
          </button>
        </div>

        {/* Tab 1: Primary Room Bookings */}
        {activeTab === "bookings" && (
          <div className="mt-6">
            {bookingsPending && (
              <div className="space-y-4">
                {["first", "second"].map((key) => (
                  <Skeleton key={key} className="h-48 rounded-2xl" />
                ))}
              </div>
            )}

            {bookingsError && (
              <Card className="rounded-2xl">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <CircleAlert className="h-5 w-5 text-amber-700" />
                    <p>
                      Bookings are unavailable. Sign in with a verified account
                      or try again.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => void refetchBookings()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {!bookingsPending && !bookingsError && bookings?.length === 0 && (
              <Card className="rounded-2xl">
                <CardContent className="py-14 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-emerald-800" />
                  <h2 className="mt-4 text-xl font-semibold">
                    No bookings yet
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    When you reserve a room, it will appear here.
                  </p>
                  <Link
                    href="/properties"
                    className="mt-5 inline-flex h-9 items-center rounded-md bg-[#173b28] px-4 text-sm font-medium text-white transition hover:bg-[#28563b]"
                  >
                    Find a room
                  </Link>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {bookings?.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onPay={() => void startBookingPayment(booking.id)}
                  paying={bookingPayment.isPending}
                  onCancel={() => void cancelBooking(booking.id)}
                  cancelling={bookingCancellation.isPending}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Sub-Room Roommate Applications */}
        {activeTab === "applications" && (
          <div className="mt-6">
            {subBookingsPending && (
              <div className="space-y-4">
                {["sub1", "sub2"].map((key) => (
                  <Skeleton key={key} className="h-48 rounded-2xl" />
                ))}
              </div>
            )}

            {subBookingsError && (
              <Card className="rounded-2xl">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <CircleAlert className="h-5 w-5 text-amber-700" />
                    <p>
                      Roommate applications could not be loaded. Please try
                      again.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => void refetchSubBookings()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {!subBookingsPending &&
              !subBookingsError &&
              subBookings?.length === 0 && (
                <Card className="rounded-2xl">
                  <CardContent className="py-14 text-center">
                    <Users className="mx-auto h-9 w-9 text-emerald-800" />
                    <h2 className="mt-4 text-xl font-semibold">
                      No roommate applications
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      When you apply to share a room as a roommate, your
                      application status will appear here.
                    </p>
                    <Link
                      href="/properties"
                      className="mt-5 inline-flex h-9 items-center rounded-md bg-[#173b28] px-4 text-sm font-medium text-white transition hover:bg-[#28563b]"
                    >
                      Browse shared rooms
                    </Link>
                  </CardContent>
                </Card>
              )}

            <div className="space-y-4">
              {subBookings?.map((subBooking) => (
                <SubBookingCard
                  key={subBooking.id}
                  booking={subBooking}
                  onPay={() => void startSubPayment(subBooking.id)}
                  paying={subBookingPayment.isPending}
                  onCancel={() => void cancelSub(subBooking.id)}
                  cancelling={subBookingCancellation.isPending}
                  onDelete={() => void deleteSub(subBooking.id)}
                  deleting={subBookingDeletion.isPending}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Incoming Roommate Requests */}
        {activeTab === "requests" && (
          <div className="mt-6">
            {requestsPending && (
              <div className="space-y-4">
                {["req1", "req2"].map((key) => (
                  <Skeleton key={key} className="h-48 rounded-2xl" />
                ))}
              </div>
            )}

            {!requestsPending && (
              <RoommateRequestsSection
                groups={incomingGroups ?? []}
                onRespond={respondToRequest}
                responding={updateSubRequest.isPending}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function BookingCard({
  booking,
  onPay,
  paying,
  onCancel,
  cancelling,
}: {
  booking: BookingRecord;
  onPay: () => void;
  paying: boolean;
  onCancel: () => void;
  cancelling: boolean;
}) {
  const depositPayments =
    booking.payments?.filter(
      (item) => item.paymentType === "SECURITY_DEPOSIT",
    ) ?? [];
  const hasActiveCheckout = depositPayments.some(
    (item) => item.paymentStatus === "PENDING" && Boolean(item.bkashPaymentID),
  );
  const canStartDeposit = depositPayments.some(
    (item) =>
      (item.paymentStatus === "PENDING" && !item.bkashPaymentID) ||
      item.paymentStatus === "FAILED" ||
      item.paymentStatus === "CANCELLED",
  );

  return (
    <Card className="rounded-2xl border-[#e0e8df] bg-white">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">
            {booking.room?.title ?? "Room booking"}
          </CardTitle>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {booking.room?.property?.title ?? "Property"}
            {booking.room?.property?.city
              ? ` · ${booking.room.property.city}`
              : ""}
          </p>
        </div>
        <span className="rounded-full bg-[#edf5ed] px-3 py-1 text-xs font-semibold text-[#315d3d]">
          {label(booking.status)}
        </span>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p>
            Occupants: <strong>{booking.occupantCount}</strong>
          </p>
          <p>
            Move in:{" "}
            <strong>
              {new Date(booking.startDate).toLocaleDateString("en-BD")}
            </strong>
          </p>
          <p>
            Deposit: <strong>{money(booking.securityDeposit)}</strong>
          </p>
          <p>
            Monthly rent: <strong>{money(booking.rentAmount)}</strong>
          </p>
        </div>
        <div className="space-y-2">
          {booking.payments?.map((item) => (
            <p key={item.id} className="text-sm">
              {label(item.paymentType)} payment:{" "}
              <strong>{label(item.paymentStatus)}</strong> ·{" "}
              {money(item.amount)}
            </p>
          ))}
          {booking.status === "PENDING" &&
            canStartDeposit &&
            !hasActiveCheckout && (
              <Button
                onClick={onPay}
                disabled={paying}
                className="mt-2 bg-[#173b28] hover:bg-[#28563b] text-white"
              >
                {paying ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                {depositPayments.some(
                  (item) =>
                    item.paymentStatus === "FAILED" ||
                    item.paymentStatus === "CANCELLED",
                )
                  ? "Retry deposit payment"
                  : "Pay deposit with bKash"}
              </Button>
            )}
          {["PENDING", "REJECTED"].includes(booking.status) && (
            <Button
              variant="destructive"
              onClick={onCancel}
              disabled={cancelling}
              className="mt-2"
            >
              {cancelling && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel request
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SubBookingCard({
  booking,
  onPay,
  paying,
  onCancel,
  cancelling,
  onDelete,
  deleting,
}: {
  booking: SubBookingRecord;
  onPay: () => void;
  paying: boolean;
  onCancel: () => void;
  cancelling: boolean;
  onDelete: () => void;
  deleting: boolean;
}) {
  const isPending = booking.status === "PENDING";
  const isAccepted = booking.status === "ACCEPTED";
  const isConfirmed = booking.status === "CONFIRMED";
  const isRejected = booking.status === "REJECTED";
  const isCancelled = booking.status === "CANCELLED";

  const paymentRecord = booking.payments?.[0];

  return (
    <Card className="rounded-2xl border-[#e0e8df] bg-white">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">
            {booking.room?.title ?? "Roommate Application"}
          </CardTitle>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {booking.room?.property?.title ?? "Property"}
            {booking.room?.property?.city
              ? ` · ${booking.room.property.city}`
              : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isConfirmed
              ? "bg-[#e5f4e8] text-[#22623a]"
              : isAccepted
                ? "bg-amber-100 text-amber-800"
                : isRejected || isCancelled
                  ? "bg-rose-100 text-rose-800"
                  : "bg-[#edf5ed] text-[#315d3d]"
          }`}
        >
          {label(booking.status)}
        </span>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p>
            Applicant: <strong>{booking.name}</strong> ({booking.gender},{" "}
            {booking.age} yrs)
          </p>
          <p>
            Occupants: <strong>{booking.occupantCount}</strong>
          </p>
          <p>
            Move-in:{" "}
            <strong>
              {new Date(booking.startDate).toLocaleDateString("en-BD")}
            </strong>
          </p>
          <p>
            Roommate Rent Share:{" "}
            <strong>
              {money(booking.subRentAmount ?? booking.room?.subRentAmount ?? 0)}
            </strong>
          </p>
        </div>

        <div className="space-y-2">
          {paymentRecord && (
            <p className="text-sm">
              Rent payment:{" "}
              <strong>{label(paymentRecord.paymentStatus)}</strong> ·{" "}
              {money(paymentRecord.amount)}
            </p>
          )}

          {isAccepted && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <p className="font-semibold">Application Accepted!</p>
              <p className="mt-1">
                Your application has been accepted. Complete your rent payment
                with bKash to confirm your move-in.
              </p>
              <Button
                onClick={onPay}
                disabled={paying}
                className="mt-3 bg-[#173b28] hover:bg-[#28563b] text-white"
                size="sm"
              >
                {paying ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Pay Rent with bKash
              </Button>
            </div>
          )}

          {isPending && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Your application is currently being reviewed by the primary
                resident.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={onCancel}
                disabled={cancelling}
              >
                {cancelling && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancel Application
              </Button>
            </div>
          )}

          {(isRejected || isCancelled) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={deleting}
              className="text-muted-foreground hover:text-red-700"
            >
              {deleting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Remove Record
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RoommateRequestsSection({
  groups,
  onRespond,
  responding,
}: {
  groups: Array<{
    bookingId: string;
    room: { id: string; title: string };
    requests: SubBookingRecord[];
  }>;
  onRespond: (id: string, status: "ACCEPTED" | "REJECTED") => void;
  responding: boolean;
}) {
  const allRequests = groups.flatMap((g) =>
    (g.requests || []).map((req) => ({ ...req, roomTitle: g.room?.title })),
  );

  if (allRequests.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="py-14 text-center">
          <Users className="mx-auto h-9 w-9 text-emerald-800" />
          <h2 className="mt-4 text-xl font-semibold">No roommate requests</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            When prospective roommates apply for your booked rooms, requests
            will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {allRequests.map((req) => (
        <Card key={req.id} className="rounded-2xl border-[#e0e8df] bg-white">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{req.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Applied for {req.roomTitle || "Room"} · {req.gender}, {req.age}{" "}
                yrs
              </p>
            </div>
            <span className="rounded-full bg-[#edf5ed] px-3 py-1 text-xs font-semibold text-[#315d3d]">
              {label(req.status)}
            </span>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p>
                Occupants: <strong>{req.occupantCount}</strong>
              </p>
              <p>
                Move-in:{" "}
                <strong>
                  {new Date(req.startDate).toLocaleDateString("en-BD")}
                </strong>
              </p>
              <p>
                Rent share: <strong>{money(req.subRentAmount ?? 0)}</strong>
              </p>
            </div>
            <div className="flex flex-col justify-end space-y-2">
              {req.status === "PENDING" ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-[#173b28] text-white hover:bg-[#28563b]"
                    disabled={responding}
                    onClick={() => onRespond(req.id, "ACCEPTED")}
                  >
                    Accept Roommate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={responding}
                    onClick={() => onRespond(req.id, "REJECTED")}
                  >
                    Decline
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Status: <strong>{label(req.status)}</strong>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
