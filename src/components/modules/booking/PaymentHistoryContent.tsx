"use client";

import { CircleAlert, CreditCard, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPayments } from "@/hooks/payment.hooks";

const label = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function PaymentHistoryContent() {
  const { data, isPending, isError, refetch } = useMyPayments();
  const payments = data?.data ?? [];
  return (
    <main className="min-h-screen bg-[#f7f9f6] px-4 pb-10 pt-28 text-[#172b20] dark:bg-background dark:text-foreground sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
              Your account
            </p>
            <h1 className="mt-2 text-3xl font-bold">Payment history</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Statuses and transaction details are read from Room Nest.
            </p>
          </div>
          <Link
            href="/dashboard/my-bookings"
            className="text-sm font-semibold text-[#173b28] dark:text-emerald-300 underline"
          >
            My bookings
          </Link>
        </div>
        {isPending && (
          <div className="mt-7 space-y-3">
            {["one", "two", "three"].map((key) => (
              <Skeleton key={key} className="h-28 rounded-2xl" />
            ))}
          </div>
        )}
        {isError && (
          <Card className="mt-7 rounded-2xl">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <p className="flex gap-2 text-sm">
                <CircleAlert className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                Payments could not be loaded. Sign in and try again.
              </p>
              <Button variant="outline" onClick={() => void refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
        {!isPending && !isError && payments.length === 0 && (
          <Card className="mt-7 rounded-2xl">
            <CardContent className="py-14 text-center">
              <ReceiptText className="mx-auto h-9 w-9 text-emerald-800 dark:text-emerald-400" />
              <h2 className="mt-4 text-xl font-semibold">No payments yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Payment records appear here after you start a booking payment.
              </p>
            </CardContent>
          </Card>
        )}
        <div className="mt-7 space-y-3">
          {payments.map((payment) => (
            <Card
              key={payment.id}
              className="rounded-2xl border-[#e0e8df] dark:border-border dark:bg-card"
            >
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#edf5ed] dark:bg-emerald-950/40 p-2 text-[#315d3d] dark:text-emerald-300">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {label(payment.paymentType)}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                  {label(payment.paymentStatus)}
                </span>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  Amount:{" "}
                  <strong>
                    {payment.currency}{" "}
                    {Number(payment.amount).toLocaleString("en-BD")}
                  </strong>
                </p>
                <p>
                  Method: <strong>{label(payment.paymentMethod)}</strong>
                </p>
                {payment.bkashTrxID && (
                  <p>
                    Transaction ID: <strong>{payment.bkashTrxID}</strong>
                  </p>
                )}
                {payment.booking?.id && (
                  <p>
                    Booking:{" "}
                    <Link
                      className="font-semibold text-[#173b28] dark:text-emerald-300 underline"
                      href="/dashboard/my-bookings"
                    >
                      View bookings
                    </Link>
                  </p>
                )}
                {payment.paidAt && (
                  <p>
                    Paid:{" "}
                    <strong>
                      {new Date(payment.paidAt).toLocaleString("en-BD")}
                    </strong>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
