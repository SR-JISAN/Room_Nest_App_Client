"use client";

import {
  BadgeDollarSign,
  FileCheck2,
  HelpCircle,
  Lock,
  Scale,
  Shield,
  ShieldCheck,
  UserCheck,
  Users2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const tenantBenefits = [
  {
    title: "Zero Hidden Brokerage",
    desc: "Direct communication with property owners and transparent monthly rent terms without unexpected middleman fees.",
    icon: BadgeDollarSign,
  },
  {
    title: "Verified Property Photos",
    desc: "Real property images and room specifications verified during landlord listing approvals.",
    icon: FileCheck2,
  },
  {
    title: "Digital bKash Receipts",
    desc: "All security deposits are processed through official bKash checkout with instant digital payment tracking.",
    icon: Lock,
  },
  {
    title: "Roommate Compatibility",
    desc: "Browse occupant limits, roommate age, gender preferences, and join shared accommodations safely.",
    icon: Users2,
  },
];

const landlordBenefits = [
  {
    title: "Verified Tenant Identity",
    desc: "All prospective tenants maintain verified email, phone, and account credentials before booking.",
    icon: UserCheck,
  },
  {
    title: "Occupancy Management",
    desc: "Manage room capacity, view current resident counts, and prevent overbooking automatically.",
    icon: Scale,
  },
  {
    title: "Automated Deposit Collection",
    desc: "Collect security deposits directly through the platform gateway with automated booking confirmations.",
    icon: Zap,
  },
  {
    title: "Centralized Dashboard",
    desc: "Real-time tracking of properties, room statuses, booking requests, and tenant summaries.",
    icon: ShieldCheck,
  },
];

const homeFaqs = [
  {
    q: "How do I secure a room booking on Room Nest?",
    a: "Select your desired property and room, specify your move-in date, and submit a booking request. You can then pay the required security deposit via bKash to confirm your booking.",
  },
  {
    q: "Can I apply to join an existing shared room as a roommate?",
    a: "Yes! Rooms designated as shared or sublet allow tenants to apply directly as roommates. The primary resident can review your profile and accept your request before payment is initiated.",
  },
  {
    q: "What happens if a landlord rejects a booking request?",
    a: "If a request cannot be fulfilled by the landlord, it is promptly marked as rejected, and you can freely explore other available properties across our directory.",
  },
  {
    q: "Are the property images real?",
    a: "Yes. All property images are provided by verified landlords and moderated by platform administrators before listings become public.",
  },
];

export default function BenefitsAndTrust() {
  return (
    <div className="space-y-16 py-16 sm:space-y-24 sm:py-24">
      {/* Benefits comparison */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2d5839] dark:text-emerald-400">
            The Room Nest Difference
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#14251b] dark:text-foreground sm:text-4xl">
            Built for Tenants & Property Owners
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#5a6e60] dark:text-muted-foreground sm:text-base">
            Every feature is engineered to simplify residential living and make
            rentals in Bangladesh safe and predictable.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Tenant column */}
          <div className="rounded-3xl border border-[#dce8de] bg-[#f9fbf9] dark:border-border dark:bg-card/70 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173b28] dark:bg-emerald-700 text-white">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#14251b] dark:text-card-foreground">
                  Why Tenants Love Us
                </h3>
                <p className="text-xs text-[#5a6e60] dark:text-muted-foreground">
                  Convenient, reliable, and fair rental experiences
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {tenantBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2a5d3b] shadow-xs border border-[#e1ece2] dark:border-border dark:bg-muted dark:text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#14251b] dark:text-card-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-[#5a6e60] dark:text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Landlord column */}
          <div className="rounded-3xl border border-[#dce8de] bg-[#f9fbf9] dark:border-border dark:bg-card/70 p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a5d3b] dark:bg-emerald-700 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#14251b] dark:text-card-foreground">
                  Why Landlords Trust Us
                </h3>
                <p className="text-xs text-[#5a6e60] dark:text-muted-foreground">
                  Streamlined listings and reliable tenant verification
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {landlordBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2a5d3b] shadow-xs border border-[#e1ece2] dark:border-border dark:bg-muted dark:text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#14251b] dark:text-card-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-[#5a6e60] dark:text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0f1f17] dark:bg-card dark:border dark:border-border px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold text-[#a8e6b5]">
              <Shield className="h-3.5 w-3.5" />
              Safety & Verification First
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl text-white">
              Your safety and security are our top priorities.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Every listing is screened by our team. We protect security
              deposits with verified checkout and enforce strict community
              standards across Dhaka.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="inline-flex h-11 items-center rounded-xl bg-[#b5e8bf] dark:bg-emerald-700 dark:text-white dark:hover:bg-emerald-600 px-6 text-sm font-semibold text-[#10251a] hover:bg-[#a0dcae]"
              >
                Learn our story
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/10"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#edf5ed] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40 px-3.5 py-1 text-xs font-bold text-[#2d5839]">
            <HelpCircle className="h-3.5 w-3.5" />
            Quick Answers
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14251b] dark:text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#5a6e60] dark:text-muted-foreground">
            Got a question? Here are answers to the most common inquiries.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {homeFaqs.map((faq) => (
            <Card
              key={faq.q}
              className="rounded-2xl border-[#e2eae3] bg-white dark:border-border dark:bg-card p-5 shadow-xs"
            >
              <h3 className="text-base font-bold text-[#14251b] dark:text-card-foreground">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5a6e60] dark:text-muted-foreground">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-[#f0f6f1] dark:bg-muted/40 dark:border dark:border-border p-6 text-center">
          <p className="text-sm font-semibold text-[#14251b] dark:text-card-foreground">
            Still have questions or need assistance with your rental?
          </p>
          <p className="mt-1 text-xs text-[#5a6e60] dark:text-muted-foreground">
            Our support team is available Sunday through Thursday to assist you.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#173b28] hover:bg-[#245638] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-5 text-xs font-semibold text-white"
          >
            Visit Support & Contact Center
          </Link>
        </div>
      </section>
    </div>
  );
}
