"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpDown,
  BedDouble,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllProperties } from "@/hooks/property.hooks";
import type { Property } from "@/types/property.type";

const PAGE_SIZE_OPTIONS = ["6", "9", "12", "18"];

const PROPERTY_TYPES = [
  { value: "ALL", label: "All property types" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "SUBLET", label: "Sublet" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "ROOM", label: "Room" },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);

const getPropertyPrice = (property: Property): number => {
  const directPrice = Number(property.rentAmount ?? property.price);

  if (Number.isFinite(directPrice) && directPrice > 0) {
    return directPrice;
  }

  const roomPrices = (property.rooms ?? [])
    .map((room) => Number(room.rentAmount))
    .filter((price) => Number.isFinite(price) && price > 0);

  return roomPrices.length ? Math.min(...roomPrices) : 0;
};

const getPropertyImage = (property: Property): string | null => {
  const images = property.propertyImages ?? property.images ?? [];

  const first = images[0];

  if (typeof first === "string") {
    return first;
  }

  if (first && typeof first === "object") {
    return first.propertyImageURL ?? first.url ?? first.imageUrl ?? null;
  }

  const possibleImage =
    property.coverImage ?? property.thumbnail ?? property.image;

  return typeof possibleImage === "string" ? possibleImage : null;
};

const getPropertyTypeLabel = (type?: string | null) =>
  PROPERTY_TYPES.find((item) => item.value === type)?.label ?? "Property";

const AllPropertyPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [pageSize, setPageSize] = useState("9");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data, isLoading, isError, refetch } = useAllProperties({
    searchTerm: search.trim() || undefined,
    propertyType: propertyType === "ALL" ? undefined : propertyType,
    page: currentPage,
    limit: Number(pageSize),
    sortBy,
    sortOrder: sortBy === "title" ? "asc" : "desc",
  });
  const properties = data?.data.result ?? [];
  const meta = data?.data.Meta;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const safePage = Math.min(currentPage, totalPages);
  const activeFilterCount = propertyType !== "ALL" ? 1 : 0;

  const resetFilters = () => {
    setSearch("");
    setPropertyType("ALL");
    setSortBy("createdAt");
    setCurrentPage(1);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id],
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: "easeOut" as const },
      };

  const route = useRouter();

  const handleMoveToDetails = (id: string) => {
    if (!id || typeof id !== "string") {
      console.error("Invalid property ID");
      return;
    }
    const params = new URLSearchParams({ id });
    route.push(`/propertyDetails/?${params.toString()}`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9f6] text-[#172b20]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#0f1f17]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#9bd5a8]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div
            {...motionProps}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-emerald-100 hover:bg-white/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Find your next home
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find a place to call <span className="text-[#a8e6b5]">home.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Discover apartments, shared rooms, houses, and sublets that fit
              your lifestyle. Your next chapter starts here.
            </p>

            <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/8 p-2 shadow-2xl backdrop-blur-xl sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <Input
                  aria-label="Search properties"
                  placeholder="Search by title, location..."
                  value={search}
                  onChange={(event) => handleSearch(event.target.value)}
                  className="h-12 border-0 bg-transparent pl-12 text-white shadow-none placeholder:text-white/45 focus-visible:ring-emerald-300 sm:h-14"
                />
              </div>

              <Button
                onClick={() => {
                  document
                    .getElementById("property-listings")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 rounded-xl bg-[#b5e8bf] px-7 font-semibold text-[#10251a] hover:bg-[#a0dcae] sm:h-14"
              >
                Explore homes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-white/65 sm:text-sm">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#a8e6b5]" />
                Easy discovery
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#a8e6b5]" />
                Flexible living
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#a8e6b5]" />
                Your next nest
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Listings */}
      <section
        id="property-listings"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <motion.div
          {...motionProps}
          className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800">
              Room Nest listings
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Explore available properties
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Find a space that feels right, whether you need a private room, a
              shared apartment, or a whole house.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#e0e8df] bg-white px-4 py-3 text-sm">
              <Building2 className="h-4 w-4 text-emerald-800" />
              <span className="font-semibold">
                {isLoading ? "..." : (meta?.total ?? properties.length)}
              </span>
              <span className="text-muted-foreground">properties found</span>
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-11 rounded-xl border-[#dce5dc] bg-white"
              >
                Clear property type
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search and sorting */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_170px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search properties or locations..."
              className="h-12 rounded-xl border-[#dce5dc] bg-white pl-11"
            />
          </div>

          <Select
            value={propertyType}
            onValueChange={(value) => {
              if (value === null) return;
              setPropertyType(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-12 rounded-xl border-[#dce5dc] bg-white">
              <Home className="mr-2 h-4 w-4 shrink-0 text-emerald-800" />
              <SelectValue placeholder="Property type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value === null) return;
              setSortBy(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-12 rounded-xl border-[#dce5dc] bg-white">
              <ArrowUpDown className="mr-2 h-4 w-4 shrink-0 text-emerald-800" />
              <SelectValue placeholder="Sort properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="title">Title: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["first", "second", "third", "fourth", "fifth", "sixth"].map(
              (skeleton) => (
                <Card
                  key={skeleton}
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
              ),
            )}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="rounded-2xl border border-red-200 bg-white px-5 py-14 text-center">
            <Building2 className="mx-auto mb-4 h-10 w-10 text-red-400" />
            <h3 className="text-lg font-semibold">Unable to load properties</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while fetching the listings.
            </p>
            <Button
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-[#173b28] hover:bg-[#245638]"
            >
              Try again
            </Button>
          </div>
        )}

        {/* Property grid */}
        {!isLoading && !isError && (
          <>
            {properties.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {properties.map((property, index) => {
                    const image = getPropertyImage(property);
                    const price = getPropertyPrice(property);
                    const isFavorite = favorites.includes(property.id);

                    return (
                      <motion.div
                        key={property.id}
                        layout={!shouldReduceMotion}
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: 24, scale: 0.98 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 0, scale: 0.96 }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.35,
                          delay: shouldReduceMotion ? 0 : index * 0.045,
                        }}
                        className="min-w-0"
                      >
                        <Card className="group h-full overflow-hidden rounded-2xl border-[#e0e8df] bg-white p-0 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#183c25]/10">
                          {/* Image */}
                          <div className="relative h-56 overflow-hidden bg-[#e3ede3] sm:h-60">
                            {image ? (
                              <Image
                                src={image}
                                alt={property.title}
                                fill
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center bg-linear-to-br from-[#dcebdd] via-[#edf4eb] to-[#c4ddc8]">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-[#315c3e] shadow-sm">
                                  <Building2 className="h-8 w-8" />
                                </div>
                                <span className="mt-3 text-xs font-medium text-[#496d50]">
                                  Room Nest Homes
                                </span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />

                            <Badge className="absolute left-4 top-4 rounded-lg border-0 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#193d27] shadow-sm hover:bg-white">
                              {getPropertyTypeLabel(property.propertyType)}
                            </Badge>

                            <Button
                              variant="secondary"
                              size="icon"
                              aria-label={
                                isFavorite
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                              onClick={() => toggleFavorite(property.id)}
                              className={`absolute right-4 top-4 h-10 w-10 rounded-full shadow-sm transition-colors ${
                                isFavorite
                                  ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                                  : "bg-white/95 text-[#253c2d] hover:bg-white"
                              }`}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  isFavorite ? "fill-current" : ""
                                }`}
                              />
                            </Button>

                            {property.verified && (
                              <Badge className="absolute bottom-4 left-4 rounded-lg border-0 bg-[#c4efcc] text-[#164426] hover:bg-[#c4efcc]">
                                <Check className="mr-1 h-3.5 w-3.5" />
                                Verified
                              </Badge>
                            )}
                          </div>

                          <CardContent className="flex h-[calc(100%-14rem)] flex-col p-5 sm:p-5">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="line-clamp-2 min-h-12 flex-1 text-lg font-bold leading-6 text-[#183321] transition-colors group-hover:text-emerald-800">
                                {property.title}
                              </h3>
                            </div>

                            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
                              <span className="line-clamp-1">
                                {property.address || "Location not specified"}
                              </span>
                            </p>

                            <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-[#718074]">
                              {property.description ||
                                "Discover the details of this property and find your next comfortable living space."}
                            </p>

                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf0eb] pt-4">
                              <div className="min-w-0">
                                {price > 0 ? (
                                  <>
                                    <p className="text-xl font-bold tracking-tight text-[#183b26]">
                                      ৳{formatPrice(price)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                      Starting rent / month
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-base font-bold text-[#183b26]">
                                      Contact for price
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                      Rent details available on request
                                    </p>
                                  </>
                                )}
                              </div>

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-[#315d3d]">
                                {property.propertyType === "ROOM" ||
                                property.propertyType === "SUBLET" ||
                                property.propertyType === "HOSTEL" ? (
                                  <BedDouble className="h-5 w-5" />
                                ) : (
                                  <Home className="h-5 w-5" />
                                )}
                              </div>
                            </div>

                            <Button
                              onClick={() => handleMoveToDetails(property.id)}
                              className="mt-5 h-11 w-full rounded-xl bg-[#173b28] font-semibold text-white transition-colors hover:bg-[#245638] flex items-center"
                            >
                              View property details
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                {...motionProps}
                className="rounded-3xl border border-dashed border-[#d2dfd1] bg-white px-5 py-16 text-center sm:py-20"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf5ed] text-[#315d3d]">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold">No properties found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Try another search term, select a different property type, or
                  change your search or property type.
                </p>
                <Button
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-[#173b28] hover:bg-[#245638]"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear all filters
                </Button>
              </motion.div>
            )}

            {/* Pagination */}
            {(meta?.total ?? properties.length) > 0 && (
              <div className="mt-9 flex flex-col gap-5 border-t border-[#e0e8df] pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-[#193d27]">
                    {(safePage - 1) * Number(pageSize) + 1}
                    {" – "}
                    {Math.min(
                      safePage * Number(pageSize),
                      meta?.total ?? properties.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#193d27]">
                    {meta?.total ?? properties.length}
                  </span>{" "}
                  properties
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={pageSize}
                    onValueChange={(value) => {
                      if (value === null) return;
                      setPageSize(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-10 w-31.25 rounded-xl bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} per page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Previous page"
                      disabled={safePage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="h-10 w-10 rounded-xl bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - safePage) <= 1,
                      )
                      .reduce<(number | "ellipsis")[]>(
                        (pages, page, index, visible) => {
                          if (index > 0 && page - visible[index - 1] > 1) {
                            pages.push("ellipsis");
                          }
                          pages.push(page);
                          return pages;
                        },
                        [],
                      )
                      .map((page, index, visible) =>
                        page === "ellipsis" ? (
                          <span
                            key={`ellipsis-${visible[index - 1]}-${visible[index + 1]}`}
                            className="px-1 text-muted-foreground"
                          >
                            …
                          </span>
                        ) : (
                          <Button
                            key={page}
                            variant="outline"
                            aria-label={`Page ${page}`}
                            aria-current={
                              safePage === page ? "page" : undefined
                            }
                            onClick={() => setCurrentPage(page)}
                            className={`h-10 min-w-10 rounded-xl ${
                              safePage === page
                                ? "border-[#173b28] bg-[#173b28] text-white hover:bg-[#245638] hover:text-white"
                                : "bg-white"
                            }`}
                          >
                            {page}
                          </Button>
                        ),
                      )}

                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Next page"
                      disabled={safePage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className="h-10 w-10 rounded-xl bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <motion.div
          {...motionProps}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#173b28] px-6 py-10 sm:px-10 sm:py-14 lg:px-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-40 border-white/5"
          />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#b7e7c1]">
                Have a property?
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Your property could be someone&apos;s next home.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
                List your property on Room Nest and help people find a place
                that fits their needs.
              </p>
            </div>

            <Link
              className="inline-flex h-12 shrink-0 items-center rounded-xl bg-[#b5e8bf] px-6 font-semibold text-[#10251a] hover:bg-[#a0dcae]"
              href="/landlord/properties/create"
            >
              List your property
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default AllPropertyPage;
