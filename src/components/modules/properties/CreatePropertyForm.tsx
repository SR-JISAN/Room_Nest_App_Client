"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CircleAlert,
  Home,
  ImagePlus,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
  useCreateProperty,
  usePropertyAmenities,
  useUploadRoomImages,
} from "@/hooks/property.hooks";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200),
  area: z.string().trim().min(2, "Area is required").max(100),
  city: z.string().trim().min(2, "City is required").max(50),
  latitude: z.string().trim().min(1, "Latitude is required"),
  longitude: z.string().trim().min(1, "Longitude is required"),
  propertyType: z.enum(["APARTMENT", "HOUSE", "SUBLET", "HOSTEL", "ROOM"]),
  amenities: z.array(z.string()).min(1, "Select at least one property amenity"),
  rooms: z
    .array(
      z.object({
        roomTitle: z
          .string()
          .trim()
          .min(2, "Room title must be at least 2 characters")
          .max(100),
        roomDescription: z
          .string()
          .trim()
          .min(5, "Room description must be at least 5 characters")
          .max(1000),
        rentAmount: z.coerce.number().positive("Rent must be positive"),
        subRentAmount: z.coerce
          .number()
          .positive("Shared rent must be positive"),
        securityDeposit: z.coerce
          .number()
          .nonnegative("Security deposit cannot be negative"),
        roomType: z.enum(["SINGLE_ROOM", "SHARED_ROOM", "MASTER_ROOM"]),
        maxRoommates: z.coerce.number().int().min(1).max(5),
        amenities: z.array(z.string()).min(1, "At least one amenity required"),
      }),
    )
    .min(1, "At least one room is required"),
});

type Fields = {
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  latitude: string;
  longitude: string;
  propertyType: "APARTMENT" | "HOUSE" | "SUBLET" | "HOSTEL" | "ROOM";
};

const roomTypes = ["SINGLE_ROOM", "SHARED_ROOM", "MASTER_ROOM"] as const;

interface RoomDraft {
  id: string;
  roomTitle: string;
  roomDescription: string;
  rentAmount: string;
  subRentAmount: string;
  securityDeposit: string;
  roomType: (typeof roomTypes)[number];
  maxRoommates: string;
  images: File[];
  imagePreviews: string[];
}

const fileError = (files: File[]) => {
  if (files.length > 6) return "Choose up to 6 property images.";
  if (
    files.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    )
  )
    return "Property images must be JPG, PNG, or WebP files.";
  if (files.some((file) => file.size > 5 * 1024 * 1024))
    return "Each property image must be 5 MB or smaller.";
  return "";
};

const roomFileError = (files: File[]) => {
  if (files.length > 4) return "Choose up to 4 room images.";
  if (
    files.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    )
  )
    return "Room images must be JPG, PNG, or WebP files.";
  if (files.some((file) => file.size > 5 * 1024 * 1024))
    return "Each room image must be 5 MB or smaller.";
  return "";
};

export default function CreatePropertyForm() {
  const router = useRouter();
  const amenitiesQuery = usePropertyAmenities();
  const create = useCreateProperty();
  const uploadRoom = useUploadRoomImages();

  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [rooms, setRooms] = useState<RoomDraft[]>([
    {
      id: "room-1",
      roomTitle: "",
      roomDescription: "",
      rentAmount: "",
      subRentAmount: "",
      securityDeposit: "",
      roomType: "SINGLE_ROOM",
      maxRoommates: "1",
      images: [],
      imagePreviews: [],
    },
  ]);

  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isUploadingRooms, setIsUploadingRooms] = useState(false);

  // Property images preview management
  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [images]);

  // Clean up all room object URLs on unmount
  useEffect(() => {
    return () => {
      rooms.forEach((r) => {
        r.imagePreviews.forEach((url) => {
          URL.revokeObjectURL(url);
        });
      });
    };
  }, [rooms]);

  const handleAddPropertyImages = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const combined = [...images, ...newFiles];
    if (combined.length > 6) {
      setFieldError("A property can have at most 6 images.");
      return;
    }
    const error = fileError(combined);
    if (error) {
      setFieldError(error);
      return;
    }
    setFieldError("");
    setImages(combined);
  };

  const handleRemovePropertyImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Multi-room handlers
  const updateRoomField = (
    roomIndex: number,
    field: keyof Omit<RoomDraft, "id" | "images" | "imagePreviews">,
    value: string,
  ) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, [field]: value } : r)),
    );
  };

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        id: `room-${Date.now()}-${prev.length + 1}`,
        roomTitle: "",
        roomDescription: "",
        rentAmount: "",
        subRentAmount: "",
        securityDeposit: "",
        roomType: "SINGLE_ROOM",
        maxRoommates: "1",
        images: [],
        imagePreviews: [],
      },
    ]);
  };

  const removeRoom = (roomIndex: number) => {
    if (rooms.length <= 1) {
      setFieldError("A property must have at least one room.");
      return;
    }
    setRooms((prev) => {
      const targetRoom = prev[roomIndex];
      targetRoom?.imagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      return prev.filter((_, i) => i !== roomIndex);
    });
  };

  const handleAddRoomImages = (roomIndex: number, files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const currentRoom = rooms[roomIndex];
    if (!currentRoom) return;

    const combined = [...currentRoom.images, ...incoming];
    if (combined.length > 4) {
      setFieldError(`Room ${roomIndex + 1} can have at most 4 images.`);
      return;
    }
    const error = roomFileError(combined);
    if (error) {
      setFieldError(error);
      return;
    }
    setFieldError("");
    const newPreviews = incoming.map((file) => URL.createObjectURL(file));
    setRooms((prev) =>
      prev.map((r, i) =>
        i === roomIndex
          ? {
              ...r,
              images: combined,
              imagePreviews: [...r.imagePreviews, ...newPreviews],
            }
          : r,
      ),
    );
  };

  const handleRemoveRoomImage = (roomIndex: number, imageIndex: number) => {
    setRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIndex) return r;
        if (r.imagePreviews[imageIndex]) {
          URL.revokeObjectURL(r.imagePreviews[imageIndex]);
        }
        return {
          ...r,
          images: r.images.filter((_, idx) => idx !== imageIndex),
          imagePreviews: r.imagePreviews.filter((_, idx) => idx !== imageIndex),
        };
      }),
    );
  };

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      area: "",
      city: "",
      latitude: "",
      longitude: "",
      propertyType: "APARTMENT",
    },
    onSubmit: async ({ value }) => {
      setMessage("");
      setFieldError("");

      if (rooms.length === 0) {
        setFieldError("At least one room is required.");
        return;
      }

      const validation = schema.safeParse({
        ...value,
        amenities,
        rooms: rooms.map((r) => ({
          roomTitle: r.roomTitle,
          roomDescription: r.roomDescription,
          rentAmount: r.rentAmount,
          subRentAmount: r.subRentAmount,
          securityDeposit: r.securityDeposit,
          roomType: r.roomType,
          maxRoommates: r.maxRoommates,
          amenities,
        })),
      });

      if (!validation.success) {
        setFieldError(
          validation.error.issues[0]?.message ??
            "Review property and room details.",
        );
        return;
      }

      const imageIssue = fileError(images);
      if (imageIssue) {
        setFieldError(imageIssue);
        return;
      }

      for (let i = 0; i < rooms.length; i++) {
        const roomIssue = roomFileError(rooms[i].images);
        if (roomIssue) {
          setFieldError(`Room ${i + 1}: ${roomIssue}`);
          return;
        }
      }

      try {
        const result = await create.mutateAsync({
          payload: validation.data,
          images,
        });

        const propertyId = result.data?.id;
        const createdRooms = result.data?.rooms ?? [];

        // Upload room photos for each room with staged images
        setIsUploadingRooms(true);
        for (let i = 0; i < rooms.length; i++) {
          const roomDraft = rooms[i];
          const createdRoomId = createdRooms[i]?.id;
          if (propertyId && createdRoomId && roomDraft.images.length > 0) {
            try {
              await uploadRoom.mutateAsync({
                propertyId,
                roomId: createdRoomId,
                images: roomDraft.images,
              });
            } catch (uploadError) {
              console.error(`Room ${i + 1} photos upload failed:`, uploadError);
            }
          }
        }
        setIsUploadingRooms(false);

        toast.add({
          title: "Property and rooms created successfully!",
          description: `Configured ${rooms.length} ${rooms.length === 1 ? "room" : "rooms"}.`,
          type: "success",
        });
        router.push("/landlord/properties");
      } catch (error) {
        setIsUploadingRooms(false);
        const fetchError = error as FetchError<{ message?: string }>;
        setMessage(
          fetchError.data?.message ??
            fetchError.message ??
            "Property could not be created.",
        );
      }
    },
  });

  if (amenitiesQuery.isPending)
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        Loading property amenities…
      </main>
    );

  if (amenitiesQuery.isError)
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p role="alert" className="text-red-700">
          Amenities could not be loaded. Sign in with a verified landlord
          account and retry.
        </p>
        <Button className="mt-4" onClick={() => void amenitiesQuery.refetch()}>
          Retry
        </Button>
      </main>
    );

  const textField = (
    name: keyof Fields,
    labelText: string,
    type = "text",
    required = true,
  ) => (
    <form.Field name={name}>
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {labelText}
            {required && " *"}
          </Label>
          <Input
            id={name}
            type={type}
            required={required}
            value={field.state.value}
            onChange={(event) =>
              field.handleChange(event.target.value as Fields[typeof name])
            }
          />
        </div>
      )}
    </form.Field>
  );

  const isSubmitting = create.isPending || isUploadingRooms;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header with Navigation Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
              Landlord Tools
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Create a property
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Define property specifications and configure one or more rooms
              with photos.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              render={<Link href="/landlord">Dashboard</Link>}
              nativeButton={false}
              className="gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="size-3.5" />
              <span>Dashboard</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              render={<Link href="/">Home</Link>}
              nativeButton={false}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Home className="size-3.5" />
              <span>Home</span>
            </Button>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Property Details */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader>
              <CardTitle>Property details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              {textField("title", "Property title")}
              <form.Field name="propertyType">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property type</Label>
                    <select
                      id="propertyType"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(
                          event.target.value as Fields["propertyType"],
                        )
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {["APARTMENT", "HOUSE", "SUBLET", "HOSTEL", "ROOM"].map(
                        (item) => (
                          <option key={item}>{item}</option>
                        ),
                      )}
                    </select>
                  </div>
                )}
              </form.Field>
              {textField("address", "Street address")}
              {textField("area", "Area")}
              {textField("city", "City")}
              {textField("latitude", "Latitude", "text")}
              {textField("longitude", "Longitude", "text")}
              <form.Field name="description">
                {(field) => (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      rows={4}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </form.Field>

              {/* Property Images Uploader */}
              <div className="space-y-3 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="property-images-input"
                    className="text-sm font-semibold"
                  >
                    Property images (up to 6, 5 MB each)
                  </Label>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {images.length} of 6 selected
                  </span>
                </div>

                <div className="rounded-xl border-2 border-dashed border-[#cfe2ce] bg-[#f9fcf9] p-5 transition hover:border-emerald-600 dark:border-border dark:bg-card">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#172b20] dark:text-foreground">
                      Upload exterior, common area, and building photos
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, WebP (up to 5 MB per photo)
                    </p>
                    <label
                      htmlFor="property-images-input"
                      className={`mt-3 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#173b28] px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-[#1f4e35] ${
                        images.length >= 6
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      Choose property photos
                      <input
                        id="property-images-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={images.length >= 6 || isSubmitting}
                        className="sr-only"
                        onChange={(event) => {
                          handleAddPropertyImages(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 md:grid-cols-6">
                    {images.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-2 shadow-xs transition hover:shadow-md"
                      >
                        <div className="relative h-24 w-full overflow-hidden rounded-lg bg-muted">
                          {imagePreviews[index] && (
                            <Image
                              src={imagePreviews[index]}
                              alt={`Property view ${index + 1}`}
                              fill
                              unoptimized
                              className="object-cover transition duration-200 group-hover:scale-105"
                            />
                          )}
                          <button
                            type="button"
                            aria-label={`Remove property image ${file.name}`}
                            onClick={() => handleRemovePropertyImage(index)}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                            Photo {index + 1}
                          </span>
                        </div>
                        <p className="mt-1.5 truncate text-xs font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="rounded-2xl border-border/80">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenitiesQuery.data?.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-2 rounded-lg border border-border/70 p-3 text-sm cursor-pointer hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity.amenityName)}
                      onChange={(event) =>
                        setAmenities((current) =>
                          event.target.checked
                            ? [...current, amenity.amenityName]
                            : current.filter(
                                (item) => item !== amenity.amenityName,
                              ),
                        )
                      }
                    />
                    <span>{amenity.amenityName}</span>
                  </label>
                ))}
              </div>
              {amenitiesQuery.data?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No amenities are configured. The server requires at least one
                  amenity to create a property.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Multi-Room Management Section */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Property Rooms</h2>
                <p className="text-sm text-muted-foreground">
                  Configure rooms and individual room photos ({rooms.length}{" "}
                  {rooms.length === 1 ? "room" : "rooms"}).
                </p>
              </div>
              <Button
                type="button"
                onClick={addRoom}
                variant="outline"
                className="gap-1.5 border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950 font-semibold text-xs"
              >
                <Plus className="size-3.5" />
                <span>Add Another Room</span>
              </Button>
            </div>

            {rooms.map((roomItem, roomIndex) => (
              <Card
                key={roomItem.id}
                className="rounded-2xl border-border/80 shadow-xs"
              >
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#173b28] text-white">
                      Room {roomIndex + 1}
                    </Badge>
                    <CardTitle className="text-base sm:text-lg">
                      {roomItem.roomTitle.trim() || `Room #${roomIndex + 1}`}
                    </CardTitle>
                  </div>
                  {rooms.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoom(roomIndex)}
                      className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Remove</span>
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="grid gap-5 pt-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`roomTitle-${roomIndex}`}>
                      Room title *
                    </Label>
                    <Input
                      id={`roomTitle-${roomIndex}`}
                      required
                      placeholder="e.g. Master Bedroom with Balcony"
                      value={roomItem.roomTitle}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "roomTitle",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`roomType-${roomIndex}`}>Room type</Label>
                    <select
                      id={`roomType-${roomIndex}`}
                      value={roomItem.roomType}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "roomType",
                          event.target.value as (typeof roomTypes)[number],
                        )
                      }
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {roomTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`rentAmount-${roomIndex}`}>
                      Monthly rent (৳) *
                    </Label>
                    <Input
                      id={`rentAmount-${roomIndex}`}
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 12000"
                      value={roomItem.rentAmount}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "rentAmount",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`subRentAmount-${roomIndex}`}>
                      Shared rent per roommate (৳) *
                    </Label>
                    <Input
                      id={`subRentAmount-${roomIndex}`}
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 6000"
                      value={roomItem.subRentAmount}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "subRentAmount",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`securityDeposit-${roomIndex}`}>
                      Security deposit (৳) *
                    </Label>
                    <Input
                      id={`securityDeposit-${roomIndex}`}
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 15000"
                      value={roomItem.securityDeposit}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "securityDeposit",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`maxRoommates-${roomIndex}`}>
                      Maximum roommates (1–5)
                    </Label>
                    <Input
                      id={`maxRoommates-${roomIndex}`}
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={roomItem.maxRoommates}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "maxRoommates",
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`roomDescription-${roomIndex}`}>
                      Room description *
                    </Label>
                    <textarea
                      id={`roomDescription-${roomIndex}`}
                      rows={3}
                      required
                      placeholder="Describe room dimensions, natural light, ventilation, attached bath, etc."
                      value={roomItem.roomDescription}
                      onChange={(event) =>
                        updateRoomField(
                          roomIndex,
                          "roomDescription",
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Room Photos */}
                  <div className="space-y-3 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`room-images-input-${roomIndex}`}
                        className="text-sm font-semibold"
                      >
                        Room photos (up to 4, 5 MB each)
                      </Label>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {roomItem.images.length} of 4 selected
                      </span>
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-[#cfe2ce] bg-[#f9fcf9] p-4 transition hover:border-emerald-600 dark:border-border dark:bg-card">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                          <ImagePlus className="h-4 w-4" />
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-[#172b20] dark:text-foreground">
                          Upload photos for this specific room
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          JPG, PNG, or WebP up to 5 MB each.
                        </p>
                        <label
                          htmlFor={`room-images-input-${roomIndex}`}
                          className={`mt-2.5 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#173b28] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1f4e35] ${
                            roomItem.images.length >= 4
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        >
                          Choose room photos
                          <input
                            id={`room-images-input-${roomIndex}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            disabled={
                              roomItem.images.length >= 4 || isSubmitting
                            }
                            className="sr-only"
                            onChange={(event) => {
                              handleAddRoomImages(
                                roomIndex,
                                event.target.files,
                              );
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {roomItem.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                        {roomItem.images.map((file, imgIdx) => (
                          <div
                            key={`${file.name}-${file.lastModified}-${imgIdx}`}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xs transition hover:shadow-md"
                          >
                            <div className="relative h-24 w-full overflow-hidden rounded-lg bg-muted">
                              {roomItem.imagePreviews[imgIdx] && (
                                <Image
                                  src={roomItem.imagePreviews[imgIdx]}
                                  alt={`Room ${roomIndex + 1} view ${imgIdx + 1}`}
                                  fill
                                  unoptimized
                                  className="object-cover transition duration-200 group-hover:scale-105"
                                />
                              )}
                              <button
                                type="button"
                                aria-label={`Remove room photo ${file.name}`}
                                onClick={() =>
                                  handleRemoveRoomImage(roomIndex, imgIdx)
                                }
                                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                                Photo {imgIdx + 1}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Bottom Add Room Button */}
            <Button
              type="button"
              onClick={addRoom}
              variant="outline"
              className="w-full border-dashed border-emerald-600/50 py-5 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40 gap-2 font-semibold"
            >
              <Plus className="size-4" />
              <span>Add Another Room ({rooms.length} configured)</span>
            </Button>
          </div>

          {(fieldError || message) && (
            <p
              role="alert"
              className="flex gap-2 text-sm text-red-700 dark:text-red-400"
            >
              <CircleAlert className="h-4 w-4 shrink-0" />
              {fieldError || message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-[#173b28] text-white hover:bg-[#204f37] sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {isUploadingRooms
                  ? "Uploading room photos…"
                  : "Creating property & rooms…"}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create property ({rooms.length}{" "}
                {rooms.length === 1 ? "room" : "rooms"})
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
