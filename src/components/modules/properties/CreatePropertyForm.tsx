"use client";

import { useForm } from "@tanstack/react-form";
import { CircleAlert, LoaderCircle, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateProperty,
  usePropertyAmenities,
} from "@/hooks/property.hooks";

const schema = z.object({
  title: z.string().trim().min(3).max(50),
  description: z.string().trim().min(10).max(2000),
  address: z.string().trim().min(5).max(200),
  area: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(50),
  latitude: z.string().trim().min(1),
  longitude: z.string().trim().min(1),
  propertyType: z.enum(["APARTMENT", "HOUSE", "SUBLET", "HOSTEL", "ROOM"]),
  amenities: z.array(z.string()).min(1),
  rooms: z
    .array(
      z.object({
        roomTitle: z.string().trim().min(2).max(100),
        roomDescription: z.string().trim().min(5).max(1000),
        rentAmount: z.coerce.number().positive(),
        subRentAmount: z.coerce.number().positive(),
        securityDeposit: z.coerce.number().nonnegative(),
        roomType: z.enum(["SINGLE_ROOM", "SHARED_ROOM", "MASTER_ROOM"]),
        maxRoommates: z.coerce.number().int().min(1).max(5),
        amenities: z.array(z.string()).min(1),
      }),
    )
    .min(1),
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
const fileError = (files: File[]) => {
  if (files.length > 6) return "Choose up to 6 property images.";
  if (
    files.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    )
  )
    return "Images must be JPG, PNG, or WebP files.";
  if (files.some((file) => file.size > 5 * 1024 * 1024))
    return "Each image must be 5 MB or smaller.";
  return "";
};

export default function CreatePropertyForm() {
  const router = useRouter();
  const amenitiesQuery = usePropertyAmenities();
  const create = useCreateProperty();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [room, setRoom] = useState({
    roomTitle: "",
    roomDescription: "",
    rentAmount: "",
    subRentAmount: "",
    securityDeposit: "",
    roomType: "SINGLE_ROOM" as (typeof roomTypes)[number],
    maxRoommates: "1",
  });
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [images]);

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
      const validation = schema.safeParse({
        ...value,
        amenities,
        rooms: [{ ...room, amenities }],
      });
      if (!validation.success) {
        setFieldError(
          validation.error.issues[0]?.message ?? "Review the property details.",
        );
        return;
      }
      const imageIssue = fileError(images);
      if (imageIssue) {
        setFieldError(imageIssue);
        return;
      }
      try {
        const result = await create.mutateAsync({
          payload: validation.data,
          images,
        });
        const propertyId = result.data?.id;
        setMessage(
          propertyId
            ? `Property created (${propertyId}).`
            : "Property created successfully.",
        );
        router.push("/landlord/properties");
      } catch (error) {
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

  return (
    <main className="min-h-screen bg-[#f7f9f6] px-4 py-10 text-[#172b20] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
          Landlord tools
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create a property</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Property and room fields match the current server contract.
          Coordinates are required by the API.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
          className="mt-7 space-y-6"
        >
          <Card className="rounded-2xl border-[#e0e8df]">
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
                      rows={5}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </form.Field>
              <div className="space-y-3 sm:col-span-2">
                <Label>Property images (up to 6, 5 MB each)</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) =>
                    setImages(Array.from(event.target.files ?? []))
                  }
                />
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {images.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="w-24"
                      >
                        <div className="relative h-20 overflow-hidden rounded-lg bg-muted">
                          {imagePreviews[index] && (
                            <Image
                              src={imagePreviews[index]}
                              alt={`Property image preview ${index + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#e0e8df]">
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenitiesQuery.data?.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-2 rounded-lg border p-3 text-sm"
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
                    {amenity.amenityName}
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

          <Card className="rounded-2xl border-[#e0e8df]">
            <CardHeader>
              <CardTitle>First room</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="roomTitle">Room title</Label>
                <Input
                  id="roomTitle"
                  value={room.roomTitle}
                  onChange={(event) =>
                    setRoom({ ...room, roomTitle: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room type</Label>
                <select
                  id="roomType"
                  value={room.roomType}
                  onChange={(event) =>
                    setRoom({
                      ...room,
                      roomType: event.target
                        .value as (typeof roomTypes)[number],
                    })
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {roomTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monthly rent (৳)</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  min="1"
                  value={room.rentAmount}
                  onChange={(event) =>
                    setRoom({ ...room, rentAmount: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subRentAmount">Per occupant rent (৳)</Label>
                <Input
                  id="subRentAmount"
                  type="number"
                  min="1"
                  value={room.subRentAmount}
                  onChange={(event) =>
                    setRoom({ ...room, subRentAmount: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security deposit (৳)</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  value={room.securityDeposit}
                  onChange={(event) =>
                    setRoom({ ...room, securityDeposit: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxRoommates">Maximum occupants (1–5)</Label>
                <Input
                  id="maxRoommates"
                  type="number"
                  min="1"
                  max="5"
                  value={room.maxRoommates}
                  onChange={(event) =>
                    setRoom({ ...room, maxRoommates: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="roomDescription">Room description</Label>
                <textarea
                  id="roomDescription"
                  rows={4}
                  value={room.roomDescription}
                  onChange={(event) =>
                    setRoom({ ...room, roomDescription: event.target.value })
                  }
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
              <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">
                Add property photos here. After creating the listing, upload
                room-specific photos from its edit page.
              </p>
            </CardContent>
          </Card>

          {(fieldError || message) && (
            <p role="alert" className="flex gap-2 text-sm text-red-700">
              <CircleAlert className="h-4 w-4 shrink-0" />
              {fieldError || message}
            </p>
          )}
          <Button
            type="submit"
            disabled={create.isPending}
            className="h-11 w-full bg-[#173b28] sm:w-auto"
          >
            {create.isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Create property
          </Button>
        </form>
      </div>
    </main>
  );
}
