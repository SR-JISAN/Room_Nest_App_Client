"use client";

import {
  CreditCard,
  KeyRound,
  Search,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HowItWorks() {
  const tenantSteps = [
    {
      step: "01",
      title: "Discover Verified Rooms",
      description:
        "Search by city, property type, or amenities with genuine pricing and verified photos.",
      icon: Search,
    },
    {
      step: "02",
      title: "Choose Rooms & Flatmates",
      description:
        "Review room capacity, roommate guidelines, and apply for private or shared living.",
      icon: Users,
    },
    {
      step: "03",
      title: "Secure with bKash Deposit",
      description:
        "Confirm your reservation with automated bKash deposit checkout and instant digital receipts.",
      icon: CreditCard,
    },
  ];

  const landlordSteps = [
    {
      step: "01",
      title: "List Details & Photos",
      description:
        "Upload property images, configure room types, rent rates, security deposit, and amenities.",
      icon: UploadCloud,
    },
    {
      step: "02",
      title: "Moderation & Verification",
      description:
        "Our platform team verifies property details so tenants book with absolute trust.",
      icon: ShieldCheck,
    },
    {
      step: "03",
      title: "Manage Tenants & Earnings",
      description:
        "Review bookings and roommate requests from your dedicated landlord dashboard.",
      icon: KeyRound,
    },
  ];

  return (
    <section className="bg-[#f7f9f6] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2d5839]">
            Transparent Process
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#14251b] sm:text-4xl">
            How Room Nest Works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#5a6e60] sm:text-base">
            A reliable experience designed for both tenants seeking spaces and
            landlords listing properties.
          </p>
        </div>

        {/* For Tenants */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173b28] text-xs font-bold text-white">
              T
            </span>
            <h3 className="text-xl font-bold text-[#14251b]">
              For Tenants & Seekers
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tenantSteps.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.step}
                  className="relative overflow-hidden rounded-2xl border-[#e1e9e2] bg-white p-6 shadow-xs"
                >
                  <span className="text-3xl font-black text-[#d2e3d5]">
                    {s.step}
                  </span>
                  <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3eb] text-[#214d2e]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 font-bold text-[#14251b]">{s.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#5a6e60]">
                    {s.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* For Landlords */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#275d3c] text-xs font-bold text-white">
              L
            </span>
            <h3 className="text-xl font-bold text-[#14251b]">
              For Property Owners
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {landlordSteps.map((s) => {
              const Icon = s.icon;
              return (
                <Card
                  key={s.step}
                  className="relative overflow-hidden rounded-2xl border-[#e1e9e2] bg-white p-6 shadow-xs"
                >
                  <span className="text-3xl font-black text-[#d2e3d5]">
                    {s.step}
                  </span>
                  <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3eb] text-[#214d2e]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 font-bold text-[#14251b]">{s.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#5a6e60]">
                    {s.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
