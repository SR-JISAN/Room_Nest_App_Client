import { Suspense } from "react";
import BookingHistoryContent from "@/components/modules/booking/BookingHistoryContent";

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={<main className="min-h-[60vh] animate-pulse bg-[#f7f9f6]" />}
    >
      <BookingHistoryContent />
    </Suspense>
  );
}
