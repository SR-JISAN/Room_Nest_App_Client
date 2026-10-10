"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  MapPin,
  PartyPopper,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import { FetchError } from "ofetch";

const money = (value?: number | string | null) =>
  `৳${Number(value ?? 0).toLocaleString("en-BD")}`;

const label = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function BookingHistoryContent() {
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "bookings" | "applications" | "requests"
  >("bookings");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const callbackStatus = params.get("status");
  const callbackError = params.get("error");
  const paymentIdParam = params.get("paymentID") || params.get("paymentId");
  const [showSuccessDialog, setShowSuccessDialog] = useState(
    callbackStatus === "success",
  );

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
  const { data: incomingGroups, isPending: requestsPending } =
    useSubBookingRequests();
  const updateSubRequest = useUpdateSubBooking();

  const totalIncomingRequests = useMemo(() => {
    if (!incomingGroups) return 0;
    return incomingGroups.reduce(
      (acc, group) => acc + (group.requests?.length ?? 0),
      0,
    );
  }, [incomingGroups]);

  useEffect(() => {
    if (callbackStatus === "success") {
      setShowSuccessDialog(true);
      void queryClient.invalidateQueries({ queryKey: ["booking"] });
      void queryClient.invalidateQueries({ queryKey: ["sub-booking"] });
      void queryClient.invalidateQueries({ queryKey: ["payments"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void refetchBookings();
      void refetchSubBookings();
    }
  }, [callbackStatus, queryClient, refetchBookings, refetchSubBookings]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["booking"] }),
        queryClient.invalidateQueries({ queryKey: ["sub-booking"] }),
        queryClient.invalidateQueries({ queryKey: ["payments"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        refetchBookings(),
        refetchSubBookings(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

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
      const fetchError = error as FetchError<{ message?: string }>;
      setErrorMessage(
        fetchError.data?.message ??
          fetchError.message ??
          "The booking could not be cancelled.",
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
    <main className="min-h-screen bg-[#f7f9f6] px-4 pb-10 pt-28 text-[#172b20] dark:bg-background dark:text-foreground sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
              Your account
            </p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">
              My bookings & roommates
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your room bookings, roommate applications, and incoming
              roommate requests.
            </p>
          </div>
          <Link
            href="/properties"
            className="text-sm font-semibold text-[#173b28] dark:text-emerald-400 underline hover:text-[#28563b] dark:hover:text-emerald-300"
          >
            Browse properties
          </Link>
        </div>

        {/* Payment Success Celebration Dialog */}
        {showSuccessDialog && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          >
            <div className="relative w-full max-w-lg rounded-3xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-6 shadow-2xl sm:p-8">
              <button
                type="button"
                onClick={() => setShowSuccessDialog(false)}
                className="absolute top-5 right-5 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-muted dark:hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50/50 dark:ring-emerald-950/40">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                  <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#173b28] text-amber-300 shadow-sm">
                    <PartyPopper className="h-4 w-4" />
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#173b28] dark:text-foreground sm:text-3xl">
                  Payment Successful!
                </h2>
                <p className="mt-2 text-sm text-[#526859] dark:text-muted-foreground sm:text-base">
                  Your security deposit has been verified and your booking is
                  now{" "}
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    Confirmed
                  </strong>
                  .
                </p>

                {paymentIdParam && (
                  <div className="mt-5 w-full rounded-2xl border border-[#e2eae3] dark:border-border bg-[#f4f7f4] dark:bg-muted/40 p-4 text-left">
                    <div className="flex items-center justify-between text-xs text-[#6b7b70] dark:text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider">
                        Transaction Reference
                      </span>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        bKash Paid
                      </span>
                    </div>
                    <p className="mt-1 break-all font-mono text-xs font-semibold text-[#172b20] dark:text-foreground sm:text-sm">
                      {paymentIdParam}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    className="flex-1 bg-[#173b28] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 py-2.5 text-white"
                    onClick={() => {
                      setShowSuccessDialog(false);
                      setActiveTab("bookings");
                    }}
                  >
                    View My Confirmed Room
                  </Button>

                  <Link
                    href="/dashboard/my-payments"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#c9d8cb] dark:border-border bg-white dark:bg-card px-4 py-2 text-sm font-semibold text-[#173b28] dark:text-emerald-300 shadow-xs hover:bg-[#edf5ed] dark:hover:bg-muted"
                  >
                    <Receipt className="h-4 w-4" />
                    Payment Receipts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Banners */}
        {callbackStatus === "success" && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/80 dark:bg-emerald-950/40 p-4 text-emerald-900 dark:text-emerald-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="font-semibold text-emerald-950 dark:text-emerald-200">
                  Payment Confirmed Successfully!
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 sm:text-sm">
                  Your room reservation is secured. You can view full
                  transaction receipts in Payment History.
                  {paymentIdParam ? ` (Ref: ${paymentIdParam})` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleManualRefresh()}
                disabled={isRefreshing}
                className="border-emerald-300 dark:border-emerald-800 bg-white dark:bg-card text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-muted"
              >
                <RefreshCw
                  className={`mr-1.5 h-3.5 w-3.5 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh Status
              </Button>
              <Link
                href="/dashboard/my-payments"
                className="rounded-lg bg-emerald-700 dark:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 dark:hover:bg-emerald-500"
              >
                View Receipt
              </Link>
            </div>
          </div>
        )}

        {callbackStatus === "failure" && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-red-900 dark:text-red-200 shadow-xs">
            <CircleAlert className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-red-950 dark:text-red-200">
                Payment Not Completed
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 sm:text-sm">
                The bKash transaction failed or was declined. Your booking
                remains pending—you can retry payment below.
              </p>
            </div>
          </div>
        )}

        {callbackStatus === "cancel" && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-900 dark:text-amber-200 shadow-xs">
            <CircleAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-amber-950 dark:text-amber-200">
                Payment Cancelled
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 sm:text-sm">
                You cancelled the checkout before completing payment. You can
                resume payment at any time below.
              </p>
            </div>
          </div>
        )}

        {callbackError === "having-issue-with-payment" && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/40 p-4 text-amber-950 dark:text-amber-200 shadow-xs">
            <div className="flex items-center gap-3">
              <CircleAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Payment Verification Note</p>
                <p className="text-xs text-amber-800 dark:text-amber-300 sm:text-sm">
                  If your bKash payment was already completed, your booking
                  status is being updated. Click Refresh to synchronize with the
                  latest server records.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleManualRefresh()}
              disabled={isRefreshing}
              className="border-amber-300 dark:border-amber-800 bg-white dark:bg-card text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-muted"
            >
              <RefreshCw
                className={`mr-1.5 h-3.5 w-3.5 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              Refresh Status
            </Button>
          </div>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3 text-sm text-red-700 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        {/* Tab switcher */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e2eae3] dark:border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "bookings"
                ? "bg-[#173b28] dark:bg-emerald-700 text-white shadow-xs"
                : "bg-white dark:bg-card border border-[#e2eae3] dark:border-border text-[#526859] dark:text-muted-foreground hover:bg-[#ebf2ec] dark:hover:bg-muted"
            }`}
          >
            Room Bookings {bookings ? `(${bookings.length})` : ""}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "applications"
                ? "bg-[#173b28] dark:bg-emerald-700 text-white shadow-xs"
                : "bg-white dark:bg-card border border-[#e2eae3] dark:border-border text-[#526859] dark:text-muted-foreground hover:bg-[#ebf2ec] dark:hover:bg-muted"
            }`}
          >
            Roommate Applications {subBookings ? `(${subBookings.length})` : ""}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "requests"
                ? "bg-[#173b28] dark:bg-emerald-700 text-white shadow-xs"
                : "bg-white dark:bg-card border border-[#e2eae3] dark:border-border text-[#526859] dark:text-muted-foreground hover:bg-[#ebf2ec] dark:hover:bg-muted"
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
                  <Skeleton
                    key={key}
                    className="h-48 rounded-2xl dark:bg-muted"
                  />
                ))}
              </div>
            )}

            {bookingsError && (
              <Card className="rounded-2xl dark:border-border dark:bg-card">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <CircleAlert className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                    <p className="text-foreground">
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
              <Card className="rounded-2xl dark:border-border dark:bg-card">
                <CardContent className="py-14 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-emerald-800 dark:text-emerald-400" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">
                    No bookings yet
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    When you reserve a room, it will appear here.
                  </p>
                  <Link
                    href="/properties"
                    className="mt-5 inline-flex h-9 items-center rounded-md bg-[#173b28] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 text-sm font-medium text-white transition"
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
                  <Skeleton
                    key={key}
                    className="h-48 rounded-2xl dark:bg-muted"
                  />
                ))}
              </div>
            )}

            {subBookingsError && (
              <Card className="rounded-2xl dark:border-border dark:bg-card">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3">
                    <CircleAlert className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                    <p className="text-foreground">
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
                <Card className="rounded-2xl dark:border-border dark:bg-card">
                  <CardContent className="py-14 text-center">
                    <Users className="mx-auto h-9 w-9 text-emerald-800 dark:text-emerald-400" />
                    <h2 className="mt-4 text-xl font-semibold text-foreground">
                      No roommate applications
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      When you apply to share a room as a roommate, your
                      application status will appear here.
                    </p>
                    <Link
                      href="/properties"
                      className="mt-5 inline-flex h-9 items-center rounded-md bg-[#173b28] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 text-sm font-medium text-white transition"
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
                  <Skeleton
                    key={key}
                    className="h-48 rounded-2xl dark:bg-muted"
                  />
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
    <Card className="rounded-2xl border-[#e0e8df] bg-white dark:border-border dark:bg-card">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg text-card-foreground">
            {booking.room?.title ?? "Room booking"}
          </CardTitle>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
            
            {booking.room?.property?.title ?? "Property"}
            {booking.room?.property?.city
              ? ` · ${booking.room.property.city}`
              : ""}
          </p>
        </div>
        <span className="rounded-full bg-[#edf5ed] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40 px-3 py-1 text-xs font-semibold text-[#315d3d]">
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
                className="mt-2 bg-[#173b28] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white"
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
    <Card className="rounded-2xl border-[#e0e8df] bg-white dark:border-border dark:bg-card">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg text-card-foreground">
            {booking.room?.title ?? "Roommate Application"}
          </CardTitle>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
            {booking.room?.property?.title ?? "Property"}
            {booking.room?.property?.city
              ? ` · ${booking.room.property.city}`
              : ""}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isConfirmed
              ? "bg-[#e5f4e8] text-[#22623a] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40"
              : isAccepted
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:border dark:border-amber-800/40"
                : isRejected || isCancelled
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 dark:border dark:border-rose-800/40"
                  : "bg-[#edf5ed] text-[#315d3d] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40"
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
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-900 dark:text-amber-200">
              <p className="font-semibold">Application Accepted!</p>
              <p className="mt-1">
                Your application has been accepted. Complete your rent payment
                with bKash to confirm your move-in.
              </p>
              <Button
                onClick={onPay}
                disabled={paying}
                className="mt-3 bg-[#173b28] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white"
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
      <Card className="rounded-2xl dark:border-border dark:bg-card">
        <CardContent className="py-14 text-center">
          <Users className="mx-auto h-9 w-9 text-emerald-800 dark:text-emerald-400" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            No roommate requests
          </h2>
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
        <Card
          key={req.id}
          className="rounded-2xl border-[#e0e8df] bg-white dark:border-border dark:bg-card"
        >
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-card-foreground">
                {req.name}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Applied for {req.roomTitle || "Room"} · {req.gender}, {req.age}{" "}
                yrs
              </p>
            </div>
            <span className="rounded-full bg-[#edf5ed] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40 px-3 py-1 text-xs font-semibold text-[#315d3d]">
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
                    className="bg-[#173b28] text-white hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600"
                    disabled={responding}
                    onClick={() => onRespond(req.id, "ACCEPTED")}
                  >
                    Accept Roommate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
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
