"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useAdminAmenities, useManageAdminAmenity } from "@/hooks/admin.hooks";

export default function AdminAmenitiesContent() {
  const [name, setName] = useState("");
  const query = useAdminAmenities();
  const mutation = useManageAdminAmenity();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amenityName = name.trim();
    if (!amenityName) return;
    try {
      await mutation.mutateAsync({ action: "add", name: amenityName });
      setName("");
      toast.add({ title: "Amenity added", type: "success" });
    } catch {
      toast.add({
        title: "Could not add amenity",
        description: "Check for duplicates and try again.",
        type: "error",
      });
    }
  }

  async function remove(amenityName: string) {
    if (!window.confirm(`Remove “${amenityName}” from the amenity catalog?`))
      return;
    try {
      await mutation.mutateAsync({ action: "delete", name: amenityName });
      toast.add({ title: "Amenity removed", type: "success" });
    } catch {
      toast.add({
        title: "Could not remove amenity",
        description: "This amenity may be in use by listings.",
        type: "error",
      });
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <header>
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold">Amenity catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the amenities landlords can select when creating listings.
        </p>
      </header>
      <Card className="rounded-xl">
        <CardContent className="p-5">
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(event) => void submit(event)}
          >
            <label className="sr-only" htmlFor="new-amenity">
              New amenity name
            </label>
            <Input
              id="new-amenity"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              placeholder="For example, Laundry"
              required
              className="min-w-0 flex-1"
            />
            <Button type="submit" disabled={mutation.isPending || !name.trim()}>
              {mutation.isPending ? "Saving…" : "Add amenity"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {query.isPending && (
        <div className="space-y-3">
          {[1, 2, 3].map((id) => (
            <Skeleton key={id} className="h-14 rounded-lg" />
          ))}
        </div>
      )}
      {query.isError && (
        <Card>
          <CardContent className="py-8 text-center">
            <p>Could not load amenities.</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => void query.refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {query.data?.map((amenity) => (
          <Card key={amenity.id}>
            <CardContent className="flex items-center justify-between gap-3 p-3 pl-4">
              <span>{amenity.amenityName}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={mutation.isPending}
                onClick={() => void remove(amenity.amenityName)}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
