"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, CircleAlert, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/ofetch";

type DashboardRole = "user" | "landlord" | "admin";
type Overview = Record<string, number | string>;
type DashboardResponse = {
  data: {
    overview: Overview;
    bookings?: Record<string, number>;
    properties?: Record<string, number>;
    payments?: Record<string, number>;
  };
};

const roleCopy: Record<
  DashboardRole,
  { title: string; description: string; stats: string[] }
> = {
  user: {
    title: "Your dashboard",
    description: "A quick view of your bookings and payments.",
    stats: ["totalBookings", "activeBookings", "totalPayments", "totalSpent"],
  },
  landlord: {
    title: "Landlord dashboard",
    description: "Track your properties, rooms, tenants, and earnings.",
    stats: [
      "totalProperties",
      "totalRooms",
      "availableRooms",
      "activeTenants",
      "totalEarnings",
    ],
  },
  admin: {
    title: "Admin dashboard",
    description:
      "Current platform totals from the Room Nest administration service.",
    stats: [
      "totalUsers",
      "totalLandlords",
      "totalProperties",
      "totalBookings",
      "totalRevenue",
    ],
  },
};

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

const formatValue = (key: string, value: number | string) => {
  if (/spent|earning|revenue/i.test(key)) {
    const amount = Number(value);
    return Number.isFinite(amount)
      ? `৳${amount.toLocaleString("en-BD")}`
      : String(value);
  }
  return typeof value === "number" ? value.toLocaleString("en-BD") : value;
};

export default function RoleDashboard({
  dashboardRole,
}: {
  dashboardRole: DashboardRole;
}) {
  const copy = roleCopy[dashboardRole];
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["dashboard", dashboardRole],
    queryFn: () =>
      apiClient<DashboardResponse>(`/api/dashboard/${dashboardRole}`),
    staleTime: 30_000,
    retry: 1,
  });

  const overview = data?.data.overview;

  return (
    <main className="min-h-[70vh] bg-[#f7f9f6] px-4 py-10 text-[#172b20] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
              Room Nest
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {dashboardRole === "user" && (
              <>
                <Link
                  href="/dashboard/my-bookings"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  My bookings
                </Link>
                <Link
                  href="/dashboard/my-payments"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Payments
                </Link>
              </>
            )}
            {dashboardRole === "landlord" && (
              <>
                <Link
                  href="/landlord/properties"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Manage properties
                </Link>
                <Link
                  href="/landlord/bookings"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Booking requests
                </Link>
                <Link
                  href="/landlord/properties/create"
                  className="inline-flex h-10 items-center rounded-xl bg-[#173b28] px-4 text-sm font-semibold text-white hover:bg-[#245638]"
                >
                  Add a property
                </Link>
              </>
            )}
            {dashboardRole === "admin" && (
              <>
                <Link
                  href="/admin/properties"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Review properties
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Manage users
                </Link>
                <Link
                  href="/admin/bookings"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Manage bookings
                </Link>
                <Link
                  href="/admin/amenities"
                  className="text-sm font-semibold text-[#1a3929] hover:underline"
                >
                  Manage amenities
                </Link>
              </>
            )}
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a3929] hover:underline"
            >
              Browse properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {isPending && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["one", "two", "three", "four"].map((key) => (
              <Card key={key} className="rounded-2xl border-[#e0e8df]">
                <CardHeader>
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card className="mt-8 rounded-2xl border-amber-200 bg-white">
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <h2 className="font-semibold">
                    Dashboard data is unavailable
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sign in with an account that has the {dashboardRole} role,
                    then try again.
                  </p>
                  <Link
                    href="/login"
                    className="mt-2 inline-block text-sm font-semibold text-[#1a3929] underline"
                  >
                    Go to login
                  </Link>
                </div>
              </div>
              <Button variant="outline" onClick={() => void refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!isPending && !isError && overview && (
          <>
            <section
              aria-label="Dashboard overview"
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {copy.stats.map((key) => (
                <Card
                  key={key}
                  className="rounded-2xl border-[#e0e8df] bg-white shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {formatLabel(key)}
                    </CardTitle>
                    <Activity className="h-4 w-4 text-emerald-800" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-[#173b28]">
                      {overview[key] === undefined
                        ? "—"
                        : formatValue(key, overview[key])}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="mt-8 grid gap-4 lg:grid-cols-2">
              {data.data.bookings && (
                <StatusCard title="Bookings" values={data.data.bookings} />
              )}
              {data.data.properties && (
                <StatusCard title="Properties" values={data.data.properties} />
              )}
              {data.data.payments && (
                <StatusCard title="Payments" values={data.data.payments} />
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatusCard({
  title,
  values,
}: {
  title: string;
  values: Record<string, number>;
}) {
  return (
    <Card className="rounded-2xl border-[#e0e8df] bg-white">
      <CardHeader>
        <CardTitle className="text-lg">{title} status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {Object.entries(values).map(([status, count]) => (
          <span
            key={status}
            className="rounded-full bg-[#edf5ed] px-3 py-1.5 text-sm text-[#315d3d]"
          >
            {formatLabel(status)}:{" "}
            <strong>{count.toLocaleString("en-BD")}</strong>
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
