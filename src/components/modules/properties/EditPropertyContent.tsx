"use client";

import {
  ArrowLeft,
  Home,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { UpdateRoomPayload } from "@/api/property.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
  useMyPropertyDetails,
  useUpdateProperty,
  useUpdatePropertyImage,
  useUpdateRoom,
  useUpdateRoomImage,
  useUploadRoomImages,
} from "@/hooks/property.hooks";
import type { Property, Room } from "@/types/property.type";

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    )
      return data.message;
  }
  return "The update could not be saved. Please check the fields and try again.";
}

function getRoomImageUrl(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const obj = item as {
      roomImageURL?: string;
      url?: string;
      imageURL?: string;
    };
    return obj.roomImageURL || obj.url || obj.imageURL || "";
  }
  return "";
}

function getRoomImageId(item: unknown): string | undefined {
  if (item && typeof item === "object" && "id" in item) {
    const id = (item as { id?: unknown }).id;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
}

function getPropertyImageUrl(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const obj = item as {
      propertyImageURL?: string;
      url?: string;
      imageUrl?: string;
      imageURL?: string;
    };
    return (
      obj.propertyImageURL || obj.url || obj.imageUrl || obj.imageURL || ""
    );
  }
  return "";
}

function getPropertyImageId(item: unknown): string | undefined {
  if (item && typeof item === "object" && "id" in item) {
    const id = (item as { id?: unknown }).id;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
}

function PropertyImagesSection({
  propertyId,
  property,
}: {
  propertyId: string;
  property: Property;
}) {
  const updateImage = useUpdatePropertyImage();
  const [replacingId, setReplacingId] = useState<string | null>(null);

  async function handleReplace(imageId: string, file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.add({ title: "Must be a JPG, PNG, or WebP file", type: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ title: "Image must be 5 MB or smaller", type: "error" });
      return;
    }
    setReplacingId(imageId);
    try {
      await updateImage.mutateAsync({
        propertyId,
        propertyImageId: imageId,
        image: file,
      });
      toast.add({
        title: "Property photo updated successfully",
        type: "success",
      });
    } catch (err) {
      toast.add({ title: errorMessage(err), type: "error" });
    } finally {
      setReplacingId(null);
    }
  }

  const images = property.propertyImages ?? [];

  return (
    <Card className="rounded-2xl border-[#e0e8df] dark:border-border dark:bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Property photos</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Current photos representing the property exterior and shared areas.
          </p>
        </div>
        <span className="rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
          {images.length} photos
        </span>
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {images.map((item, idx) => {
              const src = getPropertyImageUrl(item);
              const id = getPropertyImageId(item);
              if (!src) return null;
              const isReplacing = replacingId === id;

              return (
                <div
                  key={id ?? src ?? idx}
                  className="group relative overflow-hidden rounded-xl border border-muted bg-muted/20 p-1.5 transition hover:shadow-md"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-lg bg-black/5">
                    {/* biome-ignore lint/performance/noImgElement: dynamic Cloudinary image */}
                    <img
                      src={src}
                      alt={`${property.title} view ${idx + 1}`}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                      Photo {idx + 1}
                    </span>
                  </div>
                  {id && (
                    <div className="mt-2">
                      <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-input bg-background px-2 py-1 text-xs font-medium text-foreground transition hover:bg-muted">
                        {isReplacing ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        <span>{isReplacing ? "Updating…" : "Replace"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          disabled={isReplacing}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleReplace(id, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No property photos uploaded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function RoomEditor({ propertyId, room }: { propertyId: string; room: Room }) {
  const update = useUpdateRoom();
  const upload = useUploadRoomImages();
  const updateImage = useUpdateRoomImage();

  const [savingDetails, setSavingDetails] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [stagedPreviews, setStagedPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urls = stagedFiles.map((file) => URL.createObjectURL(file));
    setStagedPreviews(urls);
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [stagedFiles]);

  const handleStageFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const combined = [...stagedFiles, ...incoming];
    if (combined.length > 4) {
      setMessage("You can stage up to 4 photos per upload.");
      return;
    }
    const invalidType = combined.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );
    if (invalidType) {
      setMessage("Images must be JPG, PNG, or WebP files.");
      return;
    }
    const tooLarge = combined.some((file) => file.size > 5 * 1024 * 1024);
    if (tooLarge) {
      setMessage("Each image must be 5 MB or smaller.");
      return;
    }
    setMessage("");
    setStagedFiles(combined);
  };

  const handleRemoveStaged = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUploadStaged = async () => {
    if (!stagedFiles.length) return;
    setMessage("");
    try {
      await upload.mutateAsync({
        propertyId,
        roomId: room.id,
        images: stagedFiles,
      });
      setStagedFiles([]);
      toast.add({
        title: "Room photos uploaded successfully",
        type: "success",
      });
    } catch (err) {
      setMessage(errorMessage(err));
    }
  };

  const handleReplaceExisting = async (imageId: string, file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.add({ title: "Must be a JPG, PNG, or WebP file", type: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.add({ title: "Image must be 5 MB or smaller", type: "error" });
      return;
    }
    setReplacingId(imageId);
    try {
      await updateImage.mutateAsync({
        propertyId,
        roomId: room.id,
        roomImageId: imageId,
        image: file,
      });
      toast.add({ title: "Room photo updated successfully", type: "success" });
    } catch (err) {
      toast.add({ title: errorMessage(err), type: "error" });
    } finally {
      setReplacingId(null);
    }
  };

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const rentAmount = Number(form.get("rentAmount"));
    const securityDeposit = Number(form.get("securityDeposit"));
    const maxRoommates = Number(form.get("maxRoommates"));
    const payload: UpdateRoomPayload = {
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      rentAmount,
      subRentAmount: Number(form.get("subRentAmount")),
      securityDeposit,
      roomType: String(form.get("roomType") ?? "SINGLE_ROOM"),
      maxRoommates,
    };
    if (
      !payload.title ||
      !payload.description ||
      !Number.isFinite(rentAmount) ||
      rentAmount <= 0 ||
      !Number.isFinite(payload.subRentAmount) ||
      payload.subRentAmount <= 0 ||
      !Number.isFinite(securityDeposit) ||
      securityDeposit < 0 ||
      !Number.isInteger(maxRoommates) ||
      maxRoommates < 1 ||
      maxRoommates > 5
    ) {
      setMessage(
        "Enter a title, description, positive rents, a non-negative deposit, and 1–5 occupants.",
      );
      return;
    }
    setSavingDetails(true);
    setMessage("");
    try {
      await update.mutateAsync({ propertyId, roomId: room.id, payload });
      toast.add({ title: "Room details saved", type: "success" });
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setSavingDetails(false);
    }
  }

  const existingImages = room.roomImages ?? [];

  return (
    <Card className="rounded-2xl border-[#e0e8df] dark:border-border dark:bg-card">
      <CardHeader>
        <CardTitle>{room.title ?? room.name ?? "Room"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-xl border border-emerald-100 dark:border-border bg-emerald-50/30 dark:bg-background/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#172b20] dark:text-foreground">
                Room photos
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage photos for this specific room ({existingImages.length}{" "}
                uploaded)
              </p>
            </div>
            <span className="rounded-full border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
              {existingImages.length} photos
            </span>
          </div>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingImages.map((item, index) => {
                const src = getRoomImageUrl(item);
                const id = getRoomImageId(item);
                if (!src) return null;
                const isReplacing = replacingId === id;

                return (
                  <div
                    key={id ?? src ?? index}
                    className="group relative overflow-hidden rounded-xl border border-muted bg-white dark:bg-card p-1.5 shadow-xs transition hover:shadow-md"
                  >
                    <div className="relative h-24 w-full overflow-hidden rounded-lg bg-black/5">
                      {/* biome-ignore lint/performance/noImgElement: dynamic Cloudinary image */}
                      <img
                        src={src}
                        alt={`${room.title ?? "Room"} view ${index + 1}`}
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                        Photo {index + 1}
                      </span>
                    </div>
                    {id && (
                      <div className="mt-1.5">
                        <label className="flex cursor-pointer items-center justify-center gap-1 rounded-md border border-input bg-background px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted">
                          {isReplacing ? (
                            <LoaderCircle className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          <span>{isReplacing ? "Updating…" : "Replace"}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            disabled={isReplacing}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void handleReplaceExisting(id, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#173b28] dark:bg-emerald-700 px-3.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1f4e35] dark:hover:bg-emerald-600">
                <ImagePlus className="h-3.5 w-3.5" />
                Choose photos to upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={upload.isPending}
                  className="sr-only"
                  onChange={(e) => {
                    handleStageFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {stagedFiles.length > 0 && (
                <Button
                  type="button"
                  onClick={handleUploadStaged}
                  disabled={upload.isPending}
                  className="h-9 bg-emerald-700 text-xs text-white hover:bg-emerald-800"
                >
                  {upload.isPending ? (
                    <>
                      <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    `Upload ${stagedFiles.length} selected ${stagedFiles.length === 1 ? "photo" : "photos"}`
                  )}
                </Button>
              )}
              <span className="text-xs text-muted-foreground">
                Up to 4 JPG, PNG, or WebP images per upload · 5 MB each
              </span>
            </div>

            {stagedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                {stagedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${idx}`}
                    className="group relative overflow-hidden rounded-xl border border-emerald-200 dark:border-border bg-white dark:bg-card p-2 shadow-xs"
                  >
                    <div className="relative h-20 w-full overflow-hidden rounded-lg bg-muted">
                      {stagedPreviews[idx] && (
                        <Image
                          src={stagedPreviews[idx]}
                          alt={`Staged preview ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      )}
                      <button
                        type="button"
                        aria-label={`Remove photo ${file.name}`}
                        onClick={() => handleRemoveStaged(idx)}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-1 truncate text-[11px] font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB (Ready)
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => void save(event)}
        >
          <div className="space-y-2">
            <Label htmlFor={`title-${room.id}`}>Room title</Label>
            <Input
              id={`title-${room.id}`}
              name="title"
              required
              minLength={3}
              maxLength={100}
              defaultValue={room.title ?? room.name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`type-${room.id}`}>Room type</Label>
            <select
              id={`type-${room.id}`}
              name="roomType"
              defaultValue={room.roomType ?? "SINGLE_ROOM"}
              className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
            >
              <option value="SINGLE_ROOM">Single room</option>
              <option value="SHARED_ROOM">Shared room</option>
              <option value="MASTER_ROOM">Master room</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`description-${room.id}`}>Description</Label>
            <textarea
              id={`description-${room.id}`}
              name="description"
              required
              minLength={10}
              maxLength={1000}
              defaultValue={room.description ?? ""}
              className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`rent-${room.id}`}>Monthly rent (৳)</Label>
            <Input
              id={`rent-${room.id}`}
              name="rentAmount"
              type="number"
              min="1"
              step="0.01"
              required
              defaultValue={room.rentAmount ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`subrent-${room.id}`}>Shared rent (৳)</Label>
            <Input
              id={`subrent-${room.id}`}
              name="subRentAmount"
              type="number"
              min="1"
              step="0.01"
              required
              defaultValue={room.subRentAmount ?? room.rentAmount ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`deposit-${room.id}`}>Security deposit (৳)</Label>
            <Input
              id={`deposit-${room.id}`}
              name="securityDeposit"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={room.securityDeposit ?? 0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`occupants-${room.id}`}>Maximum occupants</Label>
            <Input
              id={`occupants-${room.id}`}
              name="maxRoommates"
              type="number"
              min="1"
              max="5"
              required
              defaultValue={room.maxRoommates ?? 1}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={savingDetails}>
              {savingDetails ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving room details…
                </>
              ) : (
                "Save room details"
              )}
            </Button>
          </div>
          {message && (
            <p role="alert" className="text-sm text-destructive sm:col-span-2">
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function EditPropertyContent() {
  const propertyId = useSearchParams().get("id") ?? "";
  const {
    data: property,
    isPending,
    isError,
    refetch,
  } = useMyPropertyDetails(propertyId);
  const update = useUpdateProperty();
  const [message, setMessage] = useState("");

  if (!propertyId)
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-bold">Property ID is missing</h1>
        <p className="mt-2 text-muted-foreground">
          Open Edit from your property list to manage a listing.
        </p>
      </main>
    );
  if (isPending)
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        Loading property details…
      </main>
    );
  if (isError || !property)
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-bold">Could not load this property</h1>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => void refetch()}
        >
          Try again
        </Button>
      </main>
    );

  async function saveProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      [
        "title",
        "description",
        "address",
        "area",
        "city",
        "latitude",
        "longitude",
      ].map((key) => [key, String(form.get(key) ?? "").trim()]),
    );
    if (
      payload.title.length < 3 ||
      payload.title.length > 50 ||
      payload.description.length < 20 ||
      payload.address.length < 5 ||
      payload.area.length < 2 ||
      payload.city.length < 2 ||
      !payload.latitude ||
      !payload.longitude
    ) {
      setMessage(
        "Check the required fields. Title must be 3–50 characters and description at least 20 characters.",
      );
      return;
    }
    setMessage("");
    try {
      await update.mutateAsync({ propertyId, payload });
      toast.add({ title: "Property details saved", type: "success" });
    } catch (error) {
      setMessage(errorMessage(error));
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-400">
            Landlord workspace
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Edit property</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update listing details and manage room information and photos.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            render={<Link href="/landlord/properties">My Properties</Link>}
            nativeButton={false}
            className="gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="size-3.5" />
            <span>My Properties</span>
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
      </header>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Property details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => void saveProperty(event)}
          >
            {(
              [
                ["title", "Title"],
                ["address", "Address"],
                ["area", "Area"],
                ["city", "City"],
                ["latitude", "Latitude"],
                ["longitude", "Longitude"],
              ] as const
            ).map(([name, label]) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={`property-${name}`}>{label}</Label>
                <Input
                  id={`property-${name}`}
                  name={name}
                  required
                  maxLength={name === "title" ? 50 : undefined}
                  defaultValue={property[name] ?? ""}
                />
              </div>
            ))}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="property-description">Description</Label>
              <textarea
                id="property-description"
                name="description"
                required
                minLength={20}
                maxLength={2000}
                defaultValue={property.description ?? ""}
                className="min-h-28 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? "Saving…" : "Save property details"}
              </Button>
              {message && (
                <p role="alert" className="text-sm text-destructive">
                  {message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <PropertyImagesSection propertyId={propertyId} property={property} />
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Rooms</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Room changes are saved independently. Room photo uploads are stored
            by the backend.
          </p>
        </div>
        {property.rooms?.length ? (
          property.rooms.map((room) => (
            <RoomEditor key={room.id} propertyId={propertyId} room={room} />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-muted-foreground">
              No rooms are attached to this property.
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
