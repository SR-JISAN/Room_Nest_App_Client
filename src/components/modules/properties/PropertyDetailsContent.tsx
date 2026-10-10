"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Home,
  Layers,
  MapPin,
  Maximize2,
  ShieldAlert,
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

function getRoomImages(room: Room, fallbackImage?: string): string[] {
  const extracted: string[] = [];

  if (Array.isArray(room.roomImages)) {
    for (const item of room.roomImages) {
      if (typeof item === "string" && item.trim()) {
        extracted.push(item.trim());
      } else if (item && typeof item === "object") {
        const url =
          (item as { roomImageURL?: string; url?: string; imageURL?: string })
            .roomImageURL ||
          (item as { roomImageURL?: string; url?: string; imageURL?: string })
            .url ||
          (item as { roomImageURL?: string; url?: string; imageURL?: string })
            .imageURL;
        if (typeof url === "string" && url.trim()) {
          extracted.push(url.trim());
        }
      }
    }
  }

  if (Array.isArray(room.images)) {
    for (const item of room.images) {
      if (typeof item === "string" && item.trim()) {
        extracted.push(item.trim());
      }
    }
  }

  if (typeof room.imageURL === "string" && room.imageURL.trim()) {
    extracted.push(room.imageURL.trim());
  }
  if (typeof room.imageUrl === "string" && room.imageUrl.trim()) {
    extracted.push(room.imageUrl.trim());
  }

  if (extracted.length === 0 && fallbackImage) {
    extracted.push(fallbackImage);
  }

  return Array.from(new Set(extracted.filter(Boolean)));
}

function getPropertyImages(property: Property): string[] {
  const extracted: string[] = [];

  // 1. Property images from Prisma relation
  if (Array.isArray(property.propertyImages)) {
    for (const item of property.propertyImages) {
      if (typeof item === "string" && item.trim()) {
        extracted.push(item.trim());
      } else if (item && typeof item === "object") {
        const url =
          (
            item as {
              propertyImageURL?: string;
              url?: string;
              imageURL?: string;
            }
          ).propertyImageURL ||
          (
            item as {
              propertyImageURL?: string;
              url?: string;
              imageURL?: string;
            }
          ).url ||
          (
            item as {
              propertyImageURL?: string;
              url?: string;
              imageURL?: string;
            }
          ).imageURL;
        if (typeof url === "string" && url.trim()) {
          extracted.push(url.trim());
        }
      }
    }
  }

  // 2. property.images array
  if (Array.isArray(property.images)) {
    for (const item of property.images) {
      if (typeof item === "string" && item.trim()) {
        extracted.push(item.trim());
      } else if (item && typeof item === "object") {
        const url =
          (item as { url?: string; imageUrl?: string; imageURL?: string })
            .url ||
          (item as { url?: string; imageUrl?: string; imageURL?: string })
            .imageUrl ||
          (item as { url?: string; imageUrl?: string; imageURL?: string })
            .imageURL;
        if (typeof url === "string" && url.trim()) {
          extracted.push(url.trim());
        }
      }
    }
  }

  // 3. Single image properties
  for (const singleUrl of [
    property.imageURL,
    property.imageUrl,
    property.coverImage,
    property.thumbnail,
    property.image,
  ]) {
    if (typeof singleUrl === "string" && singleUrl.trim()) {
      extracted.push(singleUrl.trim());
    }
  }

  // 4. Room images from this property
  if (Array.isArray(property.rooms)) {
    for (const room of property.rooms) {
      const roomImgs = getRoomImages(room);
      for (const img of roomImgs) {
        if (!extracted.includes(img)) {
          extracted.push(img);
        }
      }
    }
  }

  const unique = Array.from(new Set(extracted.filter(Boolean)));
  return unique.length > 0 ? unique : [FALLBACK_IMAGE];
}

function getRoomAmenities(room: Room): string[] {
  const direct = (room.amenities ?? []).map((a) =>
    typeof a === "string" ? a : "",
  );

  const fromRelation = (room.roomAmenities ?? []).map((ra) => {
    if (typeof ra === "string") return ra;
    return (
      ra?.amenity?.amenityName ||
      (ra as { amenityName?: string })?.amenityName ||
      ""
    );
  });

  return Array.from(new Set([...direct, ...fromRelation].filter(Boolean)));
}

function getPropertyAmenities(property: Property): string[] {
  const direct = [
    ...(property.amenities ?? []),
    ...(property.facilities ?? []),
  ].map((a) => (typeof a === "string" ? a : ""));

  const fromRelation = (property.propertyAmenities ?? []).map((pa) => {
    if (typeof pa === "string") return pa;
    return (
      pa?.amenity?.amenityName ||
      (pa as { amenityName?: string })?.amenityName ||
      ""
    );
  });

  return Array.from(new Set([...direct, ...fromRelation].filter(Boolean)));
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
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#548365] dark:text-emerald-400">
        {label}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#14251b] dark:text-foreground sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7b70] dark:text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function PropertyGallery({
  images,
  title,
  onOpen,
}: {
  images: string[];
  title: string;
  onOpen: (index: number) => void;
}) {
  if (images.length === 0) {
    return (
      <div className="relative flex h-72 w-full items-center justify-center rounded-2xl bg-[#e7eee8] dark:bg-muted text-[#5e7865] dark:text-muted-foreground sm:h-96">
        <div className="text-center">
          <Home
            size={48}
            className="mx-auto text-[#799982] dark:text-emerald-400"
          />
          <p className="mt-2 text-sm font-medium">
            No images uploaded for this property
          </p>
        </div>
      </div>
    );
  }

  // Exactly 1 image: Fill full container, no empty placeholder boxes!
  if (images.length === 1) {
    return (
      <div className="relative h-[340px] w-full overflow-hidden rounded-2xl bg-[#e7eee8] dark:bg-muted sm:h-[480px]">
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group relative h-full w-full text-left"
          aria-label={`View photo for ${title}`}
        >
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/95 dark:bg-card/90 px-4 py-2 text-sm font-semibold text-[#173523] dark:text-card-foreground shadow-md backdrop-blur-xs">
            <Maximize2 size={16} />
            View photo
          </span>
        </button>
      </div>
    );
  }

  // Exactly 2 images: 2 equal cards
  if (images.length === 2) {
    return (
      <div className="grid h-[300px] grid-cols-1 gap-3 sm:h-[420px] sm:grid-cols-2">
        {images.map((img, idx) => (
          <button
            key={img}
            type="button"
            onClick={() => onOpen(idx)}
            className="group relative h-full w-full overflow-hidden rounded-2xl bg-[#e7eee8] dark:bg-muted text-left"
            aria-label={`View photo ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${title} view ${idx + 1}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {idx === 1 && (
              <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/95 dark:bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-[#173523] dark:text-card-foreground shadow-md backdrop-blur-xs">
                <Maximize2 size={14} />2 photos
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Exactly 3 images: 1 large left, 2 stacked right
  if (images.length === 3) {
    return (
      <div className="grid h-[320px] grid-cols-1 gap-3 sm:h-[440px] md:grid-cols-[1.4fr_1fr]">
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group relative h-full w-full overflow-hidden rounded-2xl bg-[#e7eee8] dark:bg-muted text-left"
          aria-label="View main photo"
        >
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </button>
        <div className="grid h-full grid-rows-2 gap-3">
          {images.slice(1, 3).map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => onOpen(idx + 1)}
              className="group relative h-full w-full overflow-hidden rounded-xl bg-[#e7eee8] dark:bg-muted text-left"
              aria-label={`View photo ${idx + 2}`}
            >
              <img
                src={img}
                alt={`${title} view ${idx + 2}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {idx === 1 && (
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-card/90 px-3 py-1 text-xs font-semibold text-[#173523] dark:text-card-foreground shadow-md">
                  <Maximize2 size={13} />3 photos
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 4 or more photos: hero split grid without any empty placeholders!
  const secondaryImages = images.slice(1, 5);
  const remainingCount = images.length - 5;

  return (
    <div className="grid min-h-[340px] grid-cols-1 gap-3 sm:min-h-[440px] md:grid-cols-[1.4fr_1fr]">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="group relative min-h-[260px] overflow-hidden rounded-2xl bg-[#e7eee8] dark:bg-muted text-left sm:min-h-[400px]"
        aria-label="View main photo"
      >
        <img
          src={images[0]}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/95 dark:bg-card/90 px-4 py-2 text-sm font-semibold text-[#173523] dark:text-card-foreground shadow-md backdrop-blur-xs">
          <Maximize2 size={16} />
          View all photos ({images.length})
        </span>
      </button>

      <div
        className={`grid ${secondaryImages.length <= 2 ? "grid-cols-1" : "grid-cols-2"} gap-3`}
      >
        {secondaryImages.map((image, index) => {
          const isLast =
            index === secondaryImages.length - 1 && remainingCount > 0;

          return (
            <button
              type="button"
              key={image}
              onClick={() => onOpen(index + 1)}
              className="group relative min-h-[130px] overflow-hidden rounded-xl bg-[#e7eee8] dark:bg-muted sm:min-h-[190px]"
              aria-label={`View photo ${index + 2}`}
            >
              <img
                src={image}
                alt={`${title} view ${index + 2}`}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {isLast && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-bold text-white backdrop-blur-2xs">
                  +{remainingCount} photos
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
  propertyImage,
  onOpenImages,
}: {
  room: Room;
  propertyId: string;
  propertyImage?: string;
  onOpenImages: (images: string[]) => void;
}) {
  const [isRoommateOpen, setIsRoommateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const images = getRoomImages(room, propertyImage);
  const available = isRoomAvailable(room);
  const title = room.title || room.name || "Private Room";

  const currentRoommates = Number(room.currentRoommates ?? 0);
  const maxRoommates = Number(room.maxRoommates ?? 1);
  const isFull = currentRoommates >= maxRoommates;
  const canBookEntireRoom = available && currentRoommates === 0;
  const canJoinAsRoommate =
    available && currentRoommates > 0 && maxRoommates > currentRoommates;

  const amenities = getRoomAmenities(room);
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
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4ebe5] bg-white dark:border-border dark:bg-card transition hover:border-[#c9dccd] dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-[#1a3929]/5 dark:hover:shadow-black/40">
      <div>
        <button
          type="button"
          onClick={() => onOpenImages(images)}
          className="relative block h-52 w-full overflow-hidden bg-[#edf2ee] dark:bg-muted text-left"
          aria-label={`View images for ${title}`}
        >
          <img
            src={images[0] || propertyImage || FALLBACK_IMAGE}
            alt={title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                available
                  ? "bg-[#e5f4e8] text-[#22623a] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40"
                  : "bg-[#f3e9e7] text-[#9a4d40] dark:bg-rose-950 dark:text-rose-300 dark:border dark:border-rose-800/40"
              }`}
            >
              {available ? "Available" : "Not available"}
            </span>

            {room.roomType && (
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                {room.roomType.replaceAll("_", " ")}
              </span>
            )}
          </div>

          {avgRating && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 dark:bg-card/90 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 shadow-xs backdrop-blur-xs">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {avgRating} ({reviews.length})
            </span>
          )}
        </button>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#18291e] dark:text-card-foreground">
                {title}
              </h3>

              {room.size && (
                <p className="mt-1 text-sm text-[#748178] dark:text-muted-foreground">
                  Room size: {room.size}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-xl font-extrabold text-[#1a3929] dark:text-emerald-300">
                {formatMoney(room.rentAmount)}
              </p>
              <p className="text-xs text-[#7a887e] dark:text-muted-foreground">
                per month
              </p>
              {room.securityDeposit && (
                <p className="mt-0.5 text-xs text-[#7a887e] dark:text-muted-foreground">
                  Deposit: {formatMoney(room.securityDeposit)}
                </p>
              )}
              {room.subRentAmount && (
                <p className="mt-1 text-xs font-semibold text-[#447656] dark:text-emerald-400">
                  Roommate share: {formatMoney(room.subRentAmount)}/mo
                </p>
              )}
            </div>
          </div>

          {room.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#68776d] dark:text-muted-foreground">
              {room.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#65756a] dark:text-muted-foreground">
            {currentRoommates === 0 ? (
              <span className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-400">
                <Users size={16} />
                Vacant room (0 occupants) · Capacity: {maxRoommates}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Users size={16} />
                {currentRoommates} of {maxRoommates} roommates
                {canJoinAsRoommate
                  ? ` · ${maxRoommates - currentRoommates} spot${maxRoommates - currentRoommates === 1 ? "" : "s"} open`
                  : " · Full"}
              </span>
            )}
          </div>

          {amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-[#f2f6f2] dark:bg-muted px-3 py-1 text-xs font-medium text-[#47614f] dark:text-emerald-300"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mt-4 border-t border-[#edf2ee] dark:border-border pt-3">
              <button
                type="button"
                onClick={() => setShowReviews(!showReviews)}
                className="text-xs font-semibold text-[#447656] dark:text-emerald-400 hover:underline"
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
                      className="rounded-lg bg-[#f8faf8] dark:bg-muted/40 p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1a3929] dark:text-card-foreground">
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
                      <p className="mt-1 text-[#5c6e61] dark:text-muted-foreground">
                        {rev.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 p-5 pt-0">
        {canBookEntireRoom && (
          <Link
            href={`/booking?propertyId=${encodeURIComponent(propertyId)}&roomId=${encodeURIComponent(room.id)}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3929] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition"
          >
            Book Entire Room
            <ArrowRight size={16} />
          </Link>
        )}

        {canJoinAsRoommate && (
          <Button
            type="button"
            onClick={() => setIsRoommateOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3929] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition"
          >
            <UserPlus size={16} />
            Join as Roommate{" "}
            {room.subRentAmount
              ? `(${formatMoney(room.subRentAmount)}/mo)`
              : ""}
          </Button>
        )}

        {(!available || isFull) && !canBookEntireRoom && !canJoinAsRoommate && (
          <div className="flex w-full items-center justify-center rounded-xl bg-[#e9eee9] dark:bg-muted px-4 py-3 text-sm font-semibold text-[#879389] dark:text-muted-foreground">
            {isFull
              ? "Room is Full (Max Capacity Reached)"
              : "Currently Unavailable"}
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsReviewOpen(true)}
          className="h-8 w-full text-xs font-semibold text-[#548365] dark:text-emerald-400 hover:bg-[#f2f6f2] dark:hover:bg-muted hover:text-[#1a3929] dark:hover:text-emerald-300"
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
    () => (property ? getPropertyImages(property) : []),
    [property],
  );

  const availableRooms = useMemo(
    () => property?.rooms?.filter(isRoomAvailable) ?? [],
    [property?.rooms],
  );

  const amenities = useMemo(() => {
    if (!property) return [];
    return getPropertyAmenities(property);
  }, [property]);

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
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf7] dark:bg-background px-4">
        <div className="max-w-md text-center">
          <Home
            size={42}
            className="mx-auto text-[#668873] dark:text-emerald-400"
          />

          <h1 className="mt-4 text-2xl font-bold text-[#14251b] dark:text-foreground">
            Property ID missing
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b7b70] dark:text-muted-foreground">
            Please select a property from the listing page to view its details.
          </p>

          <Link
            href="/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1a3929] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
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
      <main className="min-h-screen bg-[#f7faf7] dark:bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-36 rounded bg-[#e2eae3] dark:bg-muted" />
          <div className="mt-7 h-10 max-w-lg rounded bg-[#e2eae3] dark:bg-muted" />

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="h-87.5 rounded-2xl bg-[#e2eae3] dark:bg-muted" />
            <div className="h-87.5 rounded-2xl bg-[#e2eae3] dark:bg-muted" />
          </div>

          <div className="mt-8 h-48 rounded-2xl bg-[#e2eae3] dark:bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !property) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf7] dark:bg-background px-4">
        <div className="max-w-md text-center">
          <Home
            size={42}
            className="mx-auto text-[#668873] dark:text-emerald-400"
          />

          <h1 className="mt-4 text-2xl font-bold text-[#14251b] dark:text-foreground">
            Could not load property
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b7b70] dark:text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading property details."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-xl bg-[#1a3929] px-5 py-3 text-sm font-bold text-white hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600"
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

  const hasCoordinates =
    property.latitude &&
    property.longitude &&
    property.latitude.trim() !== "" &&
    property.longitude.trim() !== "";

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#14251b] dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5e7464] dark:text-muted-foreground transition hover:text-[#1a3929] dark:hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Back to properties
        </Link>

        <div className="mb-6 mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {property.propertyType && (
                <span className="rounded-full bg-[#e5eee6] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#345840]">
                  {property.propertyType.replaceAll("_", " ")}
                </span>
              )}

              {property.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e1f3e6] dark:bg-emerald-950 dark:text-emerald-300 dark:border dark:border-emerald-800/40 px-3 py-1.5 text-xs font-bold text-[#27633a]">
                  <ShieldCheck size={14} />
                  Verified property
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ece7] dark:bg-amber-950 dark:text-amber-300 dark:border dark:border-amber-800/40 px-3 py-1.5 text-xs font-medium text-[#7d503f]">
                  <ShieldAlert size={14} />
                  Pending verification
                </span>
              )}

              {property.propertyStatus && (
                <span className="rounded-full bg-[#edf2ee] dark:bg-muted dark:text-muted-foreground px-2.5 py-1 text-xs font-semibold text-[#486350]">
                  {property.propertyStatus}
                </span>
              )}
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[42px]">
              {title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#6b7b70] dark:text-muted-foreground sm:text-base">
              <p className="flex items-start gap-1.5">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#548365] dark:text-emerald-400"
                />
                {location}
              </p>

              {hasCoordinates && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.latitude},${property.longitude}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2f5d3d] dark:text-emerald-400 underline hover:text-[#173b28] dark:hover:text-emerald-300"
                >
                  <ExternalLink size={13} />
                  Open in Maps
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFavorite((current) => !current)}
            className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              isFavorite
                ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
                : "border-[#dce6dd] bg-white text-[#52665a] hover:border-[#a9c4ad] dark:border-border dark:bg-card dark:text-muted-foreground dark:hover:text-foreground"
            }`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Saved" : "Save property"}
          </button>
        </div>

        {/* Gallery section with actual images and no empty placeholder cards */}
        <PropertyGallery
          images={propertyImages}
          title={title}
          onOpen={(index) => openGallery(propertyImages, index)}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-12">
          <div className="min-w-0 space-y-10">
            {/* Property Highlights from Server */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-[#e3ebe4] bg-white dark:border-border dark:bg-card p-4 sm:p-5">
                <Home
                  size={22}
                  className="text-[#548365] dark:text-emerald-400"
                />
                <p className="mt-4 text-2xl font-extrabold text-foreground">
                  {property.rooms?.length ?? 0}
                </p>
                <p className="mt-1 text-xs text-[#718075] dark:text-muted-foreground sm:text-sm">
                  Total Rooms
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3ebe4] bg-white dark:border-border dark:bg-card p-4 sm:p-5">
                <CheckCircle2
                  size={22}
                  className="text-[#548365] dark:text-emerald-400"
                />
                <p className="mt-4 text-2xl font-extrabold text-foreground">
                  {availableRooms.length}
                </p>
                <p className="mt-1 text-xs text-[#718075] dark:text-muted-foreground sm:text-sm">
                  Available Rooms
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3ebe4] bg-white dark:border-border dark:bg-card p-4 sm:p-5">
                <Layers
                  size={22}
                  className="text-[#548365] dark:text-emerald-400"
                />
                <p className="mt-4 text-lg font-bold capitalize truncate text-foreground">
                  {property.propertyType?.toLowerCase().replaceAll("_", " ") ||
                    "Rental"}
                </p>
                <p className="mt-1 text-xs text-[#718075] dark:text-muted-foreground sm:text-sm">
                  Property Type
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3ebe4] bg-white dark:border-border dark:bg-card p-4 sm:p-5">
                <ShieldCheck
                  size={22}
                  className="text-[#548365] dark:text-emerald-400"
                />
                <p className="mt-4 text-lg font-bold text-foreground">
                  {property.verified ? "Verified" : "Pending"}
                </p>
                <p className="mt-1 text-xs text-[#718075] dark:text-muted-foreground sm:text-sm">
                  Inspection
                </p>
              </div>
            </section>

            {/* Description */}
            <section>
              <SectionHeading
                label="About this property"
                title="Property Details & Living Experience"
                description="Everything you need to know about this residence."
              />

              <div className="rounded-2xl border border-[#e3ebe4] bg-white dark:border-border dark:bg-card p-5 sm:p-7">
                <p className="whitespace-pre-line text-sm leading-7 text-[#617166] dark:text-muted-foreground sm:text-base">
                  {property.description ||
                    "No description provided for this property yet. Contact the host for more information."}
                </p>

                {property.address && (
                  <div className="mt-5 rounded-xl bg-[#f5f8f5] dark:bg-muted/40 p-4 text-sm text-[#3b5943] dark:text-emerald-300">
                    <p className="font-semibold text-[#1f3d27] dark:text-foreground">
                      Full Address
                    </p>
                    <p className="mt-1 text-[#526f5a] dark:text-muted-foreground">
                      {property.address},{" "}
                      {property.area ? `${property.area}, ` : ""}
                      {property.city}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Amenities */}
            {amenities.length > 0 && (
              <section>
                <SectionHeading
                  label="Comfort and convenience"
                  title="Property Amenities & Facilities"
                  description="Verified amenities available at this property."
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-[#e3ebe4] bg-white dark:border-border dark:bg-card p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf2eb] text-[#426b4c] dark:bg-emerald-950 dark:text-emerald-300">
                        {amenity.toLowerCase().includes("wifi") ? (
                          <Wifi size={18} />
                        ) : (
                          <CheckCircle2 size={18} />
                        )}
                      </span>

                      <span className="text-sm font-medium text-[#415448] dark:text-card-foreground">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rooms Section */}
            <section id="rooms" className="scroll-mt-28">
              <SectionHeading
                label="Find your space"
                title="Rooms in this property"
                description="Compare room details, rent amounts, roommate sharing, and availability."
              />

              {property.rooms && property.rooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {property.rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      propertyId={property.id}
                      propertyImage={propertyImages[0]}
                      onOpenImages={(images) => openGallery(images)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#cad9cc] bg-white dark:border-border dark:bg-card px-5 py-12 text-center">
                  <Home
                    size={32}
                    className="mx-auto text-[#7d9883] dark:text-emerald-400"
                  />

                  <h3 className="mt-4 font-bold text-[#263d2d] dark:text-foreground">
                    No rooms listed yet
                  </h3>

                  <p className="mt-2 text-sm text-[#758278] dark:text-muted-foreground">
                    Please check back later for available rooms.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#dfe8e0] bg-white dark:border-border dark:bg-card shadow-sm">
              <div className="bg-[#173523] dark:bg-emerald-950/80 dark:border-b dark:border-border p-6 text-white">
                <p className="text-sm text-white/70">Starting from</p>

                <p className="mt-2 text-3xl font-extrabold text-white">
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
                  <p className="text-sm font-bold text-[#263d2d] dark:text-card-foreground">
                    Property overview
                  </p>

                  <div className="mt-4 space-y-4 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178] dark:text-muted-foreground">
                        Property type
                      </span>
                      <span className="text-right font-semibold text-[#334b39] dark:text-foreground">
                        {property.propertyType?.replaceAll("_", " ") ||
                          "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178] dark:text-muted-foreground">
                        Verification
                      </span>
                      <span className="font-semibold text-[#334b39] dark:text-foreground">
                        {property.verified ? "Verified" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178] dark:text-muted-foreground">
                        Total Rooms
                      </span>
                      <span className="font-semibold text-[#334b39] dark:text-foreground">
                        {property.rooms?.length ?? 0}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#748178] dark:text-muted-foreground">
                        Available Rooms
                      </span>
                      <span className="font-semibold text-[#334b39] dark:text-foreground">
                        {availableRooms.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#e7ede7] dark:border-border pt-5">
                  <p className="flex items-start gap-2 text-xs leading-5 text-[#728075] dark:text-muted-foreground">
                    <ShieldCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-[#548365] dark:text-emerald-400"
                    />
                    Review room details and confirm availability before booking.
                  </p>

                  <Link
                    href="#rooms"
                    onClick={(event) => {
                      event.preventDefault();
                      document
                        .getElementById("rooms")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3929] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition"
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
        <section className="mt-12 rounded-3xl bg-[#e8f0e8] dark:bg-card dark:border dark:border-border px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#548365] dark:text-emerald-400">
                Your next chapter
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-[#173523] dark:text-foreground sm:text-3xl">
                Ready to find your room?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#617166] dark:text-muted-foreground">
                Explore the listed rooms and choose the option that works best
                for you.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1a3929] hover:bg-[#28563b] dark:bg-emerald-700 dark:hover:bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition"
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
