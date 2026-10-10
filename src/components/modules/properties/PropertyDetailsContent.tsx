"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  Maximize2,
  ShieldCheck,
  Star,
  UserPlus,
  Users,
  Wifi,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePropertyDetails } from "@/hooks/property.hooks";
import type { Property, Room } from "@/types/property.type";
import RoommateRequestDialog from "./RoommateRequestDialog";
import RoomReviewDialog from "./RoomReviewDialog";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

function formatMoney(value?: number | string | null) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) return "৳0";

  return `৳${amount.toLocaleString("en-BD")}`;
}

function getTitle(property: Property) {
  return (
    property.title ||
    property.propertyName ||
    property.name ||
    "Rental Property"
  );
}

function getPropertyImages(property: Property): string[] {
  const images = property.propertyImages?.length
    ? property.propertyImages
    : property.images?.length
      ? property.images
      : [property.imageURL || property.imageUrl || FALLBACK_IMAGE];

  return images.filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0,
  );
}

function getRoomImages(room: Room): string[] {
  const images = room.roomImages?.length
    ? room.roomImages
    : room.images?.length
      ? room.images
      : [room.imageURL || room.imageUrl || FALLBACK_IMAGE];

  return images
    .map((img) =>
      typeof img === "string"
        ? img
        : (img as { roomImageURL?: string; url?: string })?.roomImageURL ||
          (img as { roomImageURL?: string; url?: string })?.url ||
          "",
    )
    .filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    );
}

function isRoomAvailable(room: Room) {
  return (room.roomStatus || room.status || "").toUpperCase() === "AVAILABLE";
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#548365]">
        {label}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#14251b] sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7b70] sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function PropertyGallery({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (index: number) => void;
}) {
  const secondaryImages = images.slice(1, 5);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr]">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-[#e7eee8] text-left sm:min-h-[400px]"
        aria-label="View main property image"
      >
        <img
          src={images[0] || FALLBACK_IMAGE}
          alt="Property main view"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#173523] shadow">
          <Maximize2 size={16} />
          View photos
        </span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => {
          const image = secondaryImages[index];

          return (
            <button
              type="button"
              key={`${image ?? "placeholder"}-${index}`}
              onClick={() => onOpen(index + 1)}
              className="group relative min-h-[130px] overflow-hidden rounded-xl bg-[#e7eee8] sm:min-h-[190px] md:min-h-0"
              aria-label={`View property photo ${index + 2}`}
            >
              {image ? (
                <img
                  src={image}
                  alt={`Property view ${index + 2}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-[#789080]">
                  <Home size={28} />
                </span>
              )}

              {index === 3 && images.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-bold text-white">
                  +{images.length - 4} photos
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoomCard({
  room,
  propertyId,
  onOpenImages,
}: {
  room: Room;
  propertyId: string;
  onOpenImages: (images: string[]) => void;
}) {
  const [isRoommateOpen, setIsRoommateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const images = getRoomImages(room);
  const available = isRoomAvailable(room);
  const title = room.title || room.name || "Private Room";

  const reviews = room.reviews || [];
  const ratingMap: Record<string, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, r) => acc + (ratingMap[r.reviewRating] || 5),
            0,
          ) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4ebe5] bg-white transition hover:border-[#c9dccd] hover:shadow-lg hover:shadow-[#1a3929]/5">
      <div>
        <button
          type="button"
          onClick={() => onOpenImages(images)}
          className="relative block h-52 w-full overflow-hidden bg-[#edf2ee] text-left"
          aria-label={`View images for ${title}`}
        >
          <img
            src={images[0] || FALLBACK_IMAGE}
            alt={title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold ${
              available
                ? "bg-[#e5f4e8] text-[#22623a]"
                : "bg-[#f3e9e7] text-[#9a4d40]"
            }`}
          >
            {available ? "Available" : "Not available"}
          </span>

          {avgRating && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-700 shadow-xs backdrop-blur-xs">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {avgRating} ({reviews.length})
            </span>
          )}
        </button>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#18291e]">{title}</h3>

              {room.size && (
                <p className="mt-1 text-sm text-[#748178]">
                  Room size: {room.size}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-xl font-extrabold text-[#1a3929]">
                {formatMoney(room.rentAmount)}
              </p>
              <p className="text-xs text-[#7a887e]">per month</p>
              {room.subRentAmount && (
                <p className="mt-1 text-xs font-semibold text-[#447656]">
                  Roommate share: {formatMoney(room.subRentAmount)}/mo
                </p>
              )}
            </div>
          </div>

          {room.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#68776d]">
              {room.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#65756a]">
            {typeof room.currentRoommates === "number" && (
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                {room.currentRoommates} current roommate
                {room.currentRoommates === 1 ? "" : "s"}
              </span>
            )}

            {typeof room.maxRoommates === "number" && (
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                Max {room.maxRoommates}
              </span>
            )}
          </div>

          {room.amenities && room.amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-[#f2f6f2] px-3 py-1 text-xs font-medium text-[#47614f]"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mt-4 border-t border-[#edf2ee] pt-3">
              <button
                type="button"
                onClick={() => setShowReviews(!showReviews)}
                className="text-xs font-semibold text-[#447656] hover:underline"
              >
                {showReviews
                  ? "Hide reviews"
                  : `View ${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
              </button>

              {showReviews && (
                <div className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-lg bg-[#f8faf8] p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1a3929]">
                          {rev.name}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({
                            length: ratingMap[rev.reviewRating] || 5,
                          }).map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className="fill-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 text-[#5c6e61]">{rev.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 p-5 pt-0">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href={`/booking?propertyId=${encodeURIComponent(propertyId)}&roomId=${encodeURIComponent(room.id)}`}
            aria-disabled={!available}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
              available
                ? "bg-[#1a3929] text-white hover:bg-[#28563b]"
                : "pointer-events-none bg-[#e9eee9] text-[#879389]"
            }`}
          >
            {available ? "Book Entire Room" : "Unavailable"}
            {available && <ArrowRight size={14} />}
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsRoommateOpen(true)}
            disabled={!available}
            className="flex items-center justify-center gap-1.5 rounded-xl border-[#c9dccd] px-3 py-2.5 text-xs font-bold text-[#1a3929] hover:bg-[#eef4ef]"
          >
            <UserPlus size={14} />
            Join as Roommate
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsReviewOpen(true)}
          className="h-8 w-full text-xs font-semibold text-[#548365] hover:bg-[#f2f6f2] hover:text-[#1a3929]"
        >
          <Star size={13} className="mr-1" />
          Write a Review for this Room
        </Button>
      </div>

      <RoommateRequestDialog
        open={isRoommateOpen}
        onOpenChange={setIsRoommateOpen}
        room={room}
      />

      <RoomReviewDialog
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        room={room}
      />
    </article>
  );
}

export default function PropertyDetailsContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id") as string;

  const {
    data: property,
    isLoading,
    isError,
    error,
    refetch,
  } = usePropertyDetails(propertyId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const propertyImages = useMemo(
    () => (property ? getPropertyImages(property) : [FALLBACK_IMAGE]),
    [property],
  );

  const availableRooms = useMemo(
    () => property?.rooms?.filter(isRoomAvailable) ?? [],
    [property?.rooms],
  );

  const amenities = useMemo(() => {
    const items = [
      ...(property?.amenities ?? []),
      ...(property?.facilities ?? []),
    ];

    return [...new Set(items.filter(Boolean))];
  }, [property?.amenities, property?.facilities]);

  const openGallery = (images: string[], index = 0) => {
    setGalleryImages(images.length ? images : [FALLBACK_IMAGE]);
    setActiveImage(index);
    setIsGalleryOpen(true);
  };

  const showPreviousImage = () => {
    setActiveImage((current) =>
      current <= 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    setActiveImage((current) =>
      current >= galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  if (!propertyId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf7] px-4">
        <div className="max-w-md text-center">
          <Home size={42} className="mx-auto text-[#668873]" />

          <h1 className="mt-4 text-2xl font-bold text-[#14251b]">
            Property ID missing
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b7b70]">
            Please select a property from the listing page to view its details.
          </p>

          <Link
            href="/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1a3929] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Browse properties
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7faf7] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-36 rounded bg-[#e2eae3]" />
          <div className="mt-7 h-10 max-w-lg rounded bg-[#e2eae3]" />

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="h-87.5 rounded-2xl bg-[#e2eae3]" />
            <div className="h-87.5 rounded-2xl bg-[#e2eae3]" />
          </div>

          <div className="mt-8 h-48 rounded-2xl bg-[#e2eae3]" />
        </div>
      </main>
    );
  }

  if (isError || !property) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf7] px-4">
        <div className="max-w-md text-center">
          <Home size={42} className="mx-auto text-[#668873]" />

          <h1 className="mt-4 text-2xl font-bold text-[#14251b]">
            Could not load property
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b7b70]">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading property details."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-xl bg-[#1a3929] px-5 py-3 text-sm font-bold text-white hover:bg-[#28563b]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const title = getTitle(property);

  const location =
    [property.area, property.city].filter(Boolean).join(", ") ||
    property.address ||
    property.location ||
    "Location not specified";

  const roomPrices = availableRooms
    .map((room) => Number(room.rentAmount))
    .filter((amount) => Number.isFinite(amount) && amount >= 0);

  const startingRent =
    roomPrices.length > 0 ? Math.min(...roomPrices) : property.rentAmount;

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#14251b]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5e7464] transition hover:text-[#1a3929]"
        >
          <ArrowLeft size={17} />
          Back to properties
        </Link>

        <div className="mb-6 mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {property.propertyType && (
                <span className="rounded-full bg-[#e5eee6] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#345840]">
                  {property.propertyType.replaceAll("_", " ")}
                </span>
              )}

              {property.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e1f3e6] px-3 py-1.5 text-xs font-bold text-[#27633a]">
                  <ShieldCheck size={14} />
                  Verified property
                </span>
              )}
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px]">
              {title}
            </h1>

            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#6b7b70] sm:text-base">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#548365]" />
              {location}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFavorite((current) => !current)}
            className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              isFavorite
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-[#dce6dd] bg-white text-[#52665a] hover:border-[#a9c4ad]"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved" : "Save property"}
          </button>
        </div>

        <PropertyGallery
          images={propertyImages}
          onOpen={(index) => openGallery(propertyImages, index)}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-12">
          <div className="min-w-0 space-y-10">
            {/* Property highlights */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-[#e3ebe4] bg-white p-4 sm:p-5">
                <BedDouble size={22} className="text-[#548365]" />
                <p className="mt-4 text-2xl font-extrabold">
                  {property.bedrooms ?? "—"}
                </p>
                <p className="mt-1 text-xs text-[#718075] sm:text-sm">
                  Bedrooms
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3ebe4] bg-white p-4 sm:p-5">
                <Bath size={22} className="text-[#548365]" />
                <p className="mt-4 text-2xl font-extrabold">
                  {property.bathrooms ?? "—"}
                </p>
                <p className="mt-1 text-xs text-[#718075] sm:text-sm">
                  Bathrooms
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3ebe4] bg-white p-4 sm:p-5">
                <Home size={22} className="text-[#548365]" />
                <p className="mt-4 text-2xl font-extrabold">
                  {property.rooms?.length ?? 0}
                </p>
                <p className="mt-1 text-xs text-[#718075] sm:text-sm">
                  Total rooms
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3ebe4] bg-white p-4 sm:p-5">
                <CheckCircle2 size={22} className="text-[#548365]" />
                <p className="mt-4 text-2xl font-extrabold">
                  {availableRooms.length}
                </p>
                <p className="mt-1 text-xs text-[#718075] sm:text-sm">
                  Available rooms
                </p>
              </div>
            </section>

            {/* Description */}
            <section>
              <SectionHeading
                label="About this property"
                title="A place to feel at home"
                description="Explore the property details and see if it suits your needs."
              />

              <div className="rounded-2xl border border-[#e3ebe4] bg-white p-5 sm:p-7">
                <p className="whitespace-pre-line text-sm leading-7 text-[#617166] sm:text-base">
                  {property.description ||
                    "No description has been added yet. Contact the property owner for more information."}
                </p>

                {property.size && (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f1f6f1] px-4 py-3 text-sm font-semibold text-[#3e6048]">
                    <Maximize2 size={17} />
                    Property size: {property.size}
                  </div>
                )}
              </div>
            </section>

            {/* Amenities */}
            {amenities.length > 0 && (
              <section>
                <SectionHeading
                  label="Comfort and convenience"
                  title="Property amenities"
                  description="Facilities available at this property."
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-[#e3ebe4] bg-white p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf2eb] text-[#426b4c]">
                        {amenity.toLowerCase().includes("wifi") ? (
                          <Wifi size={18} />
                        ) : (
                          <CheckCircle2 size={18} />
                        )}
                      </span>

                      <span className="text-sm font-medium text-[#415448]">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rooms */}
            <section id="rooms" className="scroll-mt-28">
              <SectionHeading
                label="Find your space"
                title="Rooms in this property"
                description="Compare room details, monthly rent, and availability before booking."
              />

              {property.rooms && property.rooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {property.rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      propertyId={property.id}
                      onOpenImages={(images) => openGallery(images)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#cad9cc] bg-white px-5 py-12 text-center">
                  <Home size={32} className="mx-auto text-[#7d9883]" />

                  <h3 className="mt-4 font-bold text-[#263d2d]">
                    No rooms listed yet
                  </h3>

                  <p className="mt-2 text-sm text-[#758278]">
                    Please check back later for available rooms.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#dfe8e0] bg-white shadow-sm">
              <div className="bg-[#173523] p-6 text-white">
                <p className="text-sm text-white/70">Starting from</p>

                <p className="mt-2 text-3xl font-extrabold">
                  {formatMoney(startingRent)}
                  <span className="ml-1 text-sm font-medium text-white/70">
                    / month
                  </span>
                </p>

                <p className="mt-2 text-sm text-white/70">
                  {availableRooms.length} room
                  {availableRooms.length === 1 ? "" : "s"} currently available
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <p className="text-sm font-bold text-[#263d2d]">
                    Property overview
                  </p>

                  <div className="mt-4 space-y-4 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178]">Property type</span>
                      <span className="text-right font-semibold text-[#334b39]">
                        {property.propertyType || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178]">Verification</span>
                      <span className="font-semibold text-[#334b39]">
                        {property.verified ? "Verified" : "Not verified"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178]">Rooms</span>
                      <span className="font-semibold text-[#334b39]">
                        {availableRooms.length} available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e7ede7] pt-5">
                  <p className="flex items-start gap-2 text-xs leading-5 text-[#728075]">
                    <ShieldCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-[#548365]"
                    />
                    Review the room details and confirm availability before
                    booking.
                  </p>

                  <Link
                    href="#rooms"
                    onClick={(event) => {
                      event.preventDefault();
                      document
                        .getElementById("rooms")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3929] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#28563b]"
                  >
                    Explore available rooms
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom CTA */}
        <section className="mt-12 rounded-3xl bg-[#e8f0e8] px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#548365]">
                Your next chapter
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-[#173523] sm:text-3xl">
                Ready to find your room?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#617166]">
                Explore the listed rooms and choose the option that works best
                for you.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1a3929] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#28563b]"
            >
              Browse more properties
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </div>

      {/* Image gallery modal */}
      {isGalleryOpen && galleryImages.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Property gallery"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
        >
          {/* Backdrop button */}
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default border-none bg-transparent"
            onClick={() => setIsGalleryOpen(false)}
            aria-label="Close modal backdrop"
          />

          <button
            type="button"
            onClick={() => setIsGalleryOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X size={22} />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => showPreviousImage()}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6"
                aria-label="Previous photo"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                type="button"
                onClick={() => showNextImage()}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6"
                aria-label="Next photo"
              >
                <ChevronRight size={25} />
              </button>
            </>
          )}

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-6xl flex-col items-center pointer-events-none">
            <img
              src={galleryImages[activeImage] || FALLBACK_IMAGE}
              alt={`Gallery slide ${activeImage + 1}`}
              className="max-h-[78vh] max-w-full rounded-lg object-contain pointer-events-auto"
            />

            <p className="mt-4 text-sm text-white/80">
              {activeImage + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
