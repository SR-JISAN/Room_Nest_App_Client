"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useAdminUsers, useChangeAdminUserStatus } from "@/hooks/admin.hooks";

export default function AdminUsersContent() {
  const [page, setPage] = useState(1);
  const query = useAdminUsers(page);
  const update = useChangeAdminUserStatus();
  const users = query.data?.result ?? [];

  async function changeStatus(userId: string, status: "ACTIVE" | "BLOCKED") {
    try {
      await update.mutateAsync({ userId, status });
      toast.add({
        title: `Account ${status === "ACTIVE" ? "activated" : "blocked"}`,
        type: "success",
      });
    } catch {
      toast.add({
        title: "Could not update account",
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
        <h1 className="mt-2 text-3xl font-bold">User management</h1>
        <p className="mt-2 text-muted-foreground">
          Review account roles and access status. Passwords and private profile
          fields are never returned here.
        </p>
      </header>
      {query.isPending && (
        <div className="space-y-3">
          {[1, 2, 3].map((id) => (
            <Skeleton key={id} className="h-20 rounded-xl" />
          ))}
        </div>
      )}
      {query.isError && (
        <Card>
          <CardContent className="py-8 text-center">
            <p>Could not load users.</p>
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
      {!query.isPending && !query.isError && users.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No user accounts on this page.
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="rounded-xl">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{user.name}</h2>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.role} · {user.status} ·{" "}
                  {user.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
              <Button
                variant={user.status === "BLOCKED" ? "default" : "outline"}
                size="sm"
                disabled={update.isPending || user.status === "DELETED"}
                onClick={() =>
                  void changeStatus(
                    user.id,
                    user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED",
                  )
                }
              >
                {user.status === "BLOCKED" ? "Activate" : "Block account"}
              </Button>
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
