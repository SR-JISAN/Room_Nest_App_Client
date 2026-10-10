"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { UpdateRoomPayload } from "@/api/property.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
  useMyPropertyDetails,
  useUpdateProperty,
  useUpdateRoom,
  useUploadRoomImages,
} from "@/hooks/property.hooks";
import type { Room } from "@/types/property.type";

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

function RoomEditor({ propertyId, room }: { propertyId: string; room: Room }) {
  const update = useUpdateRoom();
  const upload = useUploadRoomImages();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

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
    setBusy(true);
    setMessage("");
    try {
      await update.mutateAsync({ propertyId, roomId: room.id, payload });
      toast.add({ title: "Room details saved", type: "success" });
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function addImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (
      files.length > 4 ||
      files.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 5 * 1024 * 1024,
      )
    ) {
      setMessage(
        "Choose up to 4 JPG, PNG, or WebP images, each no larger than 5 MB.",
      );
      event.target.value = "";
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await upload.mutateAsync({ propertyId, roomId: room.id, images: files });
      toast.add({ title: "Room photos uploaded", type: "success" });
      event.target.value = "";
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{room.title ?? room.name ?? "Room"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {room.roomImages?.length ? (
          <div className="flex gap-3 overflow-x-auto">
            {room.roomImages.map((item, index) => {
              const src =
                typeof item === "string"
                  ? item
                  : (item.roomImageURL ?? item.url);
              return src ? (
                // API image URLs are hosted dynamically; next/image would require unsafe remote host configuration.
                // biome-ignore lint/performance/noImgElement: room images come from backend-configured Cloudinary URLs.
                <img
                  key={typeof item === "string" ? item : (item.id ?? src)}
                  src={src}
                  alt={`${room.title ?? "Room"}, view ${index + 1}`}
                  className="h-24 w-32 shrink-0 rounded-lg object-cover"
                />
              ) : null;
            })}
          </div>
        ) : null}
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
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save room details"}
            </Button>
            <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border px-3 text-sm hover:bg-muted">
              Upload room photos
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                disabled={busy}
                onChange={(event) => void addImages(event)}
              />
            </label>
            <span className="text-xs text-muted-foreground">
              Up to 4 JPG, PNG, or WebP images per upload · 5 MB each
            </span>
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
      <header>
        <p className="text-sm font-medium text-emerald-800">
          Landlord workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold">Edit property</h1>
        <p className="mt-2 text-muted-foreground">
          Update listing details and manage room information and photos.
        </p>
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
