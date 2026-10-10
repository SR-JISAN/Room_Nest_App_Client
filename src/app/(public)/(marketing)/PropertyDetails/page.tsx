"use client";

import { Suspense } from "react";
import PropertyDetailsContent from "@/components/modules/properties/PropertyDetailsContent";

export default function PropertyDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf7] px-4">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dce9df] border-t-[#1a3929]" />
            <p className="mt-4 text-sm font-medium text-[#52665a]">
              Loading property details...
            </p>
          </div>
        </main>
      }
    >
      <PropertyDetailsContent />
    </Suspense>
  );
}
