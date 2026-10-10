"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  useAdminProperties,
  useChangeAdminPropertyStatus,
} from "@/hooks/admin.hooks";

export default function AdminPropertiesContent() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("PENDING");
  const query = useAdminProperties(page, status);
  const update = useChangeAdminPropertyStatus();

  async function change(
    propertyId: string,
    nextStatus: "APPROVED" | "REJECTED",
  ) {
    try {
      await update.mutateAsync({ propertyId, status: nextStatus });
      toast.add({
        title: `Property ${nextStatus.toLowerCase()}`,
        type: "success",
      });
    } catch {
      toast.add({
        title: "Could not update property status",
        description: "Please try again.",
        type: "error",
      });
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <header>
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold">Property moderation</h1>
        <p className="mt-2 text-muted-foreground">
          Review real submissions and set the backend listing status.
        </p>
      </header>
      <label className="flex w-full max-w-xs flex-col gap-2 text-sm font-medium">
        Filter by status
        <select
          className="h-10 rounded-lg border dark:border-border bg-background text-foreground px-3"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="PENDING">Pending review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="ALL">All statuses</option>
        </select>
      </label>
      {query.isPending && (
        <div className="space-y-3">
          {[1, 2, 3].map((id) => (
            <Skeleton key={id} className="h-24 rounded-xl" />
          ))}
        </div>
      )}
      {query.isError && (
        <Card>
          <CardContent className="py-8 text-center">
            <p>Could not load properties.</p>
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
      {!query.isPending &&
        !query.isError &&
        query.data?.result.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No properties match this status.
            </CardContent>
          </Card>
        )}
      <div className="space-y-3">
        {query.data?.result.map((property) => (
          <Card key={property.id} className="rounded-xl">
            <CardContent className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <h2 className="font-semibold">{property.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {property.address} · {property.area}, {property.city} ·{" "}
                  {property.propertyType}
                </p>
                <p className="mt-2 max-w-3xl text-sm">{property.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Landlord: {property.users.name} ({property.users.email}) ·{" "}
                  {property.rooms.length} rooms · {property.propertyStatus}
                </p>
                {property.propertyStatus === "APPROVED" && (
                  <Link
                    className="mt-2 inline-flex text-sm font-medium text-emerald-900 dark:text-emerald-300 underline"
                    href={`/propertyDetails?id=${encodeURIComponent(property.id)}`}
                  >
                    Open public details
                  </Link>
                )}
              </div>
              <div className="flex gap-2">
                {property.propertyStatus !== "APPROVED" && (
                  <Button
                    size="sm"
                    disabled={update.isPending}
                    onClick={() => void change(property.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                )}
                {property.propertyStatus !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={update.isPending}
                    onClick={() => void change(property.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {query.data && query.data.Meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {query.data.Meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= query.data.Meta.totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
