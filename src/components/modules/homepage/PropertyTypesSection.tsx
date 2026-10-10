"use client";

import {
  BedDouble,
  Building2,
  Home,
  Hotel,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const categories = [
  {
    type: "APARTMENT",
    label: "Apartments & Flats",
    description:
      "Self-contained family and shared modern apartments in key areas.",
    icon: Building2,
    badge: "Most Popular",
  },
  {
    type: "ROOM",
    label: "Private & Shared Rooms",
    description:
      "Budget-friendly rooms for bachelor professionals and students.",
    icon: BedDouble,
    badge: "Affordable",
  },
  {
    type: "SUBLET",
    label: "Sublets & Temporary Living",
    description:
      "Flexible short-term and furnished sublet spaces with utilities.",
    icon: Layers,
    badge: "Flexible",
  },
  {
    type: "HOUSE",
    label: "Independent Houses",
    description:
      "Spacious multi-room independent houses and duplex residences.",
    icon: Home,
    badge: "Spacious",
  },
  {
    type: "HOSTEL",
    label: "Student & Working Hostels",
    description:
      "Equipped hostel spaces with dining, security, and cleaning services.",
    icon: Hotel,
    badge: "All-Inclusive",
  },
];

export default function PropertyTypesSection() {
  return (
    <section className="border-t border-[#e2eae3] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#edf5ed] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2d5839]">
            <Sparkles className="h-3.5 w-3.5" />
            Tailored For Your Lifestyle
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14251b] sm:text-4xl">
            Explore by Property Type
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#5a6e60] sm:text-base">
            From single private rooms to complete family apartments, find the
            living arrangement that fits your budget and lifestyle.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.type}
                href={`/properties?propertyType=${cat.type}`}
                className="group block"
              >
                <Card className="h-full rounded-2xl border-[#e2eae3] bg-[#f9fbf9] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#9ecfa9] hover:bg-white hover:shadow-lg hover:shadow-[#173b28]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e6f1e8] text-[#245433] transition-colors group-hover:bg-[#173b28] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#345840] border border-[#d8e3da]">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-[#14251b] group-hover:text-emerald-800">
                    {cat.label}
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-[#5a6e60]">
                    {cat.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
