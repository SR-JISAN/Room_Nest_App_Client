"use client";

import {
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="isolate bg-[#0a1510] text-[#c9d9cf]">
      {/* Decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none   w-80 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#a8e6b5]/10 blur-3xl"
      />

      {/* Top Highlights Banner */}
      <div className="border-b border-white/10 bg-[#0f1f17]/60 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-[#a8e6b5]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Verified Listings
              </h4>
              <p className="text-xs text-[#9bb3a4]">
                Properties verified for authenticity and safety
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-[#a8e6b5]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Secure Payments</h4>
              <p className="text-xs text-[#9bb3a4]">
                Seamless bKash deposits with clear receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-[#a8e6b5]">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Roommate Matching
              </h4>
              <p className="text-xs text-[#9bb3a4]">
                Connect with compatible flatmates easily
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Room Nest Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-2xl font-black tracking-tight text-white">
                Room <span className="text-[#a8e6b5]">Nest</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-[#9bb3a4]">
              A modern rental and roommate discovery platform built for tenants,
              students, professionals, and landlords across Bangladesh. Find
              your place, live comfortably.
            </p>

            <div className="space-y-2 text-sm text-[#9bb3a4]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#a8e6b5]" />
                Dhaka, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#a8e6b5]" />
                support@roomnest.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#a8e6b5]" />
                +880 1700-000000
              </p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/properties"
                  className="transition hover:text-white"
                >
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=APARTMENT"
                  className="transition hover:text-white"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=SUBLET"
                  className="transition hover:text-white"
                >
                  Sublets
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=ROOM"
                  className="transition hover:text-white"
                >
                  Single & Shared Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=HOSTEL"
                  className="transition hover:text-white"
                >
                  Hostels
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/landlord/properties/create"
                  className="transition hover:text-white"
                >
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-white">
                  Create an Account
                </Link>
              </li>
            </ul>
          </div>

          {/* For Landlords & Trust */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Trust & Safety
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <span className="text-[#849e8e]">Identity Verification</span>
              </li>
              <li>
                <span className="text-[#849e8e]">Security Deposits</span>
              </li>
              <li>
                <span className="text-[#849e8e]">Transparent Rents</span>
              </li>
              <li>
                <span className="text-[#849e8e]">bKash Verified Gateways</span>
              </li>
              <li>
                <span className="text-[#849e8e]">Community Guidelines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#08110d] px-4 py-6 text-xs text-[#849e8e] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {currentYear} Room Nest. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white">
              Support Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
