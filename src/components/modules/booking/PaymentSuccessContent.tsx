"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Home,
  PartyPopper,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const paymentID =
    searchParams.get("paymentID") ||
    searchParams.get("paymentId") ||
    searchParams.get("trxID") ||
    searchParams.get("trxId");
  const status = searchParams.get("status") || "success";
  const [mountedTime] = useState(() => new Date().toLocaleString("en-BD"));

  // Invalidate caches so dashboard and bookings reflect latest paid status
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: ["booking"] });
    void queryClient.invalidateQueries({ queryKey: ["sub-booking"] });
    void queryClient.invalidateQueries({ queryKey: ["payments"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }, [queryClient]);

  return (
    <main className="min-h-[80vh] bg-gradient-to-b from-[#f2f7f3] to-[#fcfdfc] dark:from-background dark:to-background px-4 py-12 text-[#172b20] dark:text-foreground sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-[#d6e4d8] dark:border-border bg-white dark:bg-card shadow-xl shadow-emerald-950/5 dark:shadow-none">
          {/* Top Decorative Banner */}
          <div className="bg-gradient-to-r from-[#173b28] via-[#245238] to-[#173b28] px-6 py-10 text-center text-white sm:px-10">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-8 ring-white/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-300 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[#173b28] shadow-md">
                <PartyPopper className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-800/60 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-100 ring-1 ring-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Security Deposit Verified
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Payment Successful!
            </h1>
            <p className="mt-2 text-sm text-emerald-100/90 sm:text-base">
              Your room reservation is locked in and your security deposit has
              been safely recorded.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Payment Details Box */}
            <div className="rounded-2xl border border-[#e2eae3] dark:border-border bg-[#f8faf8] dark:bg-background/80 p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#526859] dark:text-muted-foreground">
                Transaction Summary
              </h2>

              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-xs text-[#6b7b70] dark:text-muted-foreground">
                    Payment Method
                  </dt>
                  <dd className="mt-0.5 font-semibold text-[#172b20] dark:text-card-foreground">
                    bKash Checkout
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#6b7b70] dark:text-muted-foreground">
                    Payment Status
                  </dt>
                  <dd className="mt-0.5 inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    {status.toUpperCase()} / CONFIRMED
                  </dd>
                </div>

                {paymentID && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#6b7b70] dark:text-muted-foreground">
                      bKash Transaction Reference
                    </dt>
                    <dd className="mt-0.5 break-all font-mono text-xs sm:text-sm font-semibold text-[#173b28] dark:text-emerald-300">
                      {paymentID}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-xs text-[#6b7b70] dark:text-muted-foreground">
                    Timestamp
                  </dt>
                  <dd className="mt-0.5 text-xs text-[#526859] dark:text-muted-foreground">
                    {mountedTime}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#6b7b70] dark:text-muted-foreground">
                    Security
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    SSL Protected & Escrowed
                  </dd>
                </div>
              </dl>
            </div>

            {/* What's Next Steps */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-bold text-[#172b20] dark:text-card-foreground">
                What happens next?
              </h3>

              <div className="flex items-start gap-3 rounded-xl bg-white dark:bg-background/60 p-3 ring-1 ring-black/5 dark:ring-border">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf5ed] dark:bg-emerald-950/50 text-[#173b28] dark:text-emerald-300">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div className="text-xs leading-5 text-[#526859] dark:text-muted-foreground">
                  <strong className="text-[#172b20] dark:text-card-foreground">
                    Host Notification:
                  </strong>{" "}
                  Your landlord has received notice of the deposit confirmation
                  and will coordinate check-in.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-white dark:bg-background/60 p-3 ring-1 ring-black/5 dark:ring-border">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf5ed] dark:bg-emerald-950/50 text-[#173b28] dark:text-emerald-300">
                  <Receipt className="h-4 w-4" />
                </div>
                <div className="text-xs leading-5 text-[#526859] dark:text-muted-foreground">
                  <strong className="text-[#172b20] dark:text-card-foreground">
                    Payment Record:
                  </strong>{" "}
                  You can inspect or download your invoice anytime in Payment
                  History.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/my-bookings"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173b28] dark:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#28563b] dark:hover:bg-emerald-600"
              >
                Go to My Bookings
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/my-payments"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c9d8cb] dark:border-border bg-white dark:bg-card px-5 py-3 text-sm font-semibold text-[#173b28] dark:text-emerald-300 shadow-xs transition hover:bg-[#edf5ed] dark:hover:bg-accent"
              >
                <Receipt className="h-4 w-4" />
                View Payment Receipts
              </Link>
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/properties"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#526859] dark:text-muted-foreground hover:text-[#173b28] dark:hover:text-emerald-300"
              >
                <Home className="h-3.5 w-3.5" />
                Return to Room Nest properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
