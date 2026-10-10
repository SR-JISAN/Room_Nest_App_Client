"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Check, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllProperties } from "@/hooks/property.hooks";
import type { Property } from "@/types/property.type";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(value);

const getPropertyPrice = (property: Property): number => {
  const directPrice = Number(property.rentAmount ?? property.price);
  if (Number.isFinite(directPrice) && directPrice > 0) return directPrice;
  const roomPrices = (property.rooms ?? [])
    .map((room) => Number(room.rentAmount))
    .filter((p) => Number.isFinite(p) && p > 0);
  return roomPrices.length ? Math.min(...roomPrices) : 0;
};

const getPropertyImage = (property: Property): string | null => {
  const images = property.propertyImages ?? property.images ?? [];
  const first = images[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object") {
    return first.propertyImageURL ?? first.url ?? first.imageUrl ?? null;
  }
  const possible = property.coverImage ?? property.thumbnail ?? property.image;
  return typeof possible === "string" ? possible : null;
};

export default function FeaturedProperties() {
  const _shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { data, isLoading } = useAllProperties({
    limit: 6,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const properties = data?.data.result ?? [];

  return (
    <section className="bg-[#f7f9f6] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f2e9] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2d5839]">
              <Sparkles className="h-3.5 w-3.5" />
              Verified & Handpicked
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#14251b] sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#5a6e60] sm:text-base">
              Discover verified apartments, rooms, and sublets recently listed
              on Room Nest.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#173b28] hover:underline"
          >
            Explore all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <Card
                key={key}
                className="overflow-hidden rounded-2xl border-[#e1e8df] p-0"
              >
                <Skeleton className="h-56 w-full rounded-none" />
                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Properties grid */}
        {!isLoading && properties.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const image = getPropertyImage(property);
              const price = getPropertyPrice(property);

              return (
                <Card
                  key={property.id}
                  className="group h-full overflow-hidden rounded-2xl border-[#e0e8df] bg-white p-0 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#183c25]/10"
                >
                  <div className="relative h-56 overflow-hidden bg-[#e3ede3]">
                    {image ? (
                      <Image
                        src={image}
                        alt={property.title}
                        fill
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-linear-to-br from-[#dcebdd] to-[#c4ddc8]">
                        <Building2 className="h-8 w-8 text-[#315c3e]" />
                        <span className="mt-2 text-xs font-semibold text-[#496d50]">
                          Room Nest
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />

                    <Badge className="absolute left-4 top-4 rounded-lg border-0 bg-white/95 px-3 py-1 text-xs font-semibold text-[#193d27]">
                      {property.propertyType?.replaceAll("_", " ") ??
                        "Property"}
                    </Badge>

                    {property.verified && (
                      <Badge className="absolute bottom-4 left-4 rounded-lg border-0 bg-[#c4efcc] text-[#164426]">
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <CardContent className="flex flex-col p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-[#183321] transition-colors group-hover:text-emerald-800">
                      {property.title}
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#5a6e60]">
                      <MapPin className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
                      <span className="line-clamp-1">
                        {property.area ||
                          property.city ||
                          property.address ||
                          "Dhaka, Bangladesh"}
                      </span>
                    </p>

                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#718074]">
                      {property.description ||
                        "Discover comfort and convenience at this verified rental."}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#edf0eb] pt-4">
                      <div>
                        {price > 0 ? (
                          <>
                            <p className="text-lg font-bold text-[#183b26]">
                              ৳{formatPrice(price)}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Rent / month
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-semibold text-[#183b26]">
                            Contact for rent
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={() =>
                          router.push(`/propertyDetails/?id=${property.id}`)
                        }
                        className="h-10 rounded-xl bg-[#173b28] px-4 text-xs font-semibold text-white hover:bg-[#245638]"
                      >
                        View Details
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Fallback if no properties available yet */}
        {!isLoading && properties.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-[#cfe0d2] bg-white p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-emerald-700" />
            <h3 className="mt-4 text-lg font-bold">New listings coming soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you a landlord? Be the first to list your property on Room
              Nest.
            </p>
            <Link
              href="/landlord/properties/create"
              className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#173b28] px-5 text-sm font-semibold text-white hover:bg-[#245638]"
            >
              List a property
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
