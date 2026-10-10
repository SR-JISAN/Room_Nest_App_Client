import { Suspense } from "react";
import BookingCreateContent from "@/components/modules/booking/BookingCreateContent";

export default function BookingPage() {
  return (
    <Suspense
      fallback={<main className="min-h-[60vh] animate-pulse bg-[#f7f9f6]" />}
    >
      <BookingCreateContent />
    </Suspense>
  );
}
