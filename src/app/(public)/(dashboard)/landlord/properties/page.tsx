"use client";

import { Building2, Home, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useDeleteProperty, useMyProperties } from "@/hooks/property.hooks";

function PropertyImage({
  image,
  title,
}: {
  image?: string | null;
  title: string;
}) {
  return image ? (
    // External image hosts are supplied by the API, so a plain img avoids assuming an allowlisted host.
    // biome-ignore lint/performance/noImgElement: URLs are supplied dynamically by the backend.
    <img src={image} alt={title} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300">
      <Building2 aria-hidden="true" className="size-10" />
    </div>
  );
}

export default function LandlordPropertiesPage() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch } = useMyProperties(page);
  const remove = useDeleteProperty();
  const properties = data?.data.result ?? [];

  async function handleDelete(id: string, title: string) {
    if (
      !window.confirm(
        `Delete “${title}”? This will remove it from active listings.`,
      )
    )
      return;
    try {
      await remove.mutateAsync(id);
      toast.add({ title: "Property deleted", type: "success" });
    } catch {
      toast.add({
        title: "Could not delete property",
        description: "Please try again.",
        type: "error",
      });
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
            Landlord workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Your properties
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review listing status and manage your property records.
          </p>
        </div>
        <Link
          href="/landlord/properties/create"
          className="inline-flex h-10 items-center rounded-lg bg-emerald-900 dark:bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800 dark:hover:bg-emerald-600"
        >
          <Plus aria-hidden="true" className="mr-2 size-4" />
          Add property
        </Link>
      </div>

      {isPending && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-72 rounded-2xl" />
          ))}
        </div>
      )}
      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p>We couldn’t load your property list.</p>
            <Button variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      )}
      {!isPending && !isError && properties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Home className="size-10 text-emerald-800 dark:text-emerald-400" />
            <h2 className="mt-4 text-xl font-semibold">No properties yet</h2>
            <p className="mt-2 text-muted-foreground">
              Create a listing to start managing your rentals here.
            </p>
            <Link
              className="mt-5 inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
              href="/landlord/properties/create"
            >
              Create a property
            </Link>
          </CardContent>
        </Card>
      )}

      {!isPending && !isError && properties.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const firstImage = property.propertyImages?.[0];
              const photo =
                (typeof firstImage === "string"
                  ? firstImage
                  : (firstImage?.propertyImageURL ??
                    firstImage?.url ??
                    firstImage?.imageUrl)) ??
                property.images?.[0] ??
                property.imageURL ??
                property.imageUrl;
              return (
                <Card
                  key={property.id}
                  className="overflow-hidden rounded-2xl border-emerald-950/10 dark:border-border"
                >
                  <div className="h-48">
                    <PropertyImage image={photo} title={property.title} />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="line-clamp-1 font-semibold">
                          {property.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {property.area}, {property.city}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-medium text-emerald-900 dark:text-emerald-300">
                        {property.propertyStatus ?? "Pending review"}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{property.rooms?.length ?? 0} rooms</span>
                      <span>{property.propertyType}</span>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <Link
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border dark:border-border px-3 text-sm hover:bg-muted dark:text-foreground"
                        href={`/propertyDetails?id=${encodeURIComponent(property.id)}`}
                      >
                        View listing
                      </Link>
                      <Link
                        className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-emerald-900 dark:bg-emerald-700 px-3 text-sm text-white hover:bg-emerald-800 dark:hover:bg-emerald-600"
                        href={`/landlord/properties/edit?id=${encodeURIComponent(property.id)}`}
                      >
                        Edit
                      </Link>
                      <Button
                        aria-label={`Delete ${property.title}`}
                        variant="outline"
                        disabled={remove.isPending}
                        onClick={() =>
                          void handleDelete(property.id, property.title)
                        }
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {data && data.data.Meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.data.Meta.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= data.data.Meta.totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
