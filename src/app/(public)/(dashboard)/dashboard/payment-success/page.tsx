import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentSuccessContent from "@/components/modules/booking/PaymentSuccessContent";

export const metadata: Metadata = {
  title: "Payment Successful | Room Nest Dashboard",
  description:
    "Your payment has been processed and your room booking is confirmed.",
};

export default function DashboardPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[80vh] flex items-center justify-center bg-[#f7f9f6]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#173b28] border-t-transparent" />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
