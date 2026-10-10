"use client";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  Home,
  LayoutDashboard,
  Lock,
  Plus,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Footer from "@/components/layout/public/Footer";
import Navbar from "@/components/layout/public/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks";

interface NavTab {
  name: string;
  path: string;
  icon: typeof LayoutDashboard;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading } = useUserProfile();

  const user = data?.data;
  const role = user?.role;

  // Determine which section the user is currently visiting
  const section = useMemo(() => {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/landlord")) return "landlord";
    return "user";
  }, [pathname]);

  // Determine authorized role destination for "Back to Dashboard"
  const dashboardHome = useMemo(() => {
    if (role === "ADMIN") return "/admin";
    if (role === "LANDLORD") return "/landlord";
    return "/user";
  }, [role]);

  // Role tabs
  const tabs: NavTab[] = useMemo(() => {
    if (section === "landlord") {
      return [
        { name: "Overview", path: "/landlord", icon: LayoutDashboard },
        {
          name: "My Properties",
          path: "/landlord/properties",
          icon: Building2,
        },
        {
          name: "Bookings",
          path: "/landlord/bookings",
          icon: CalendarDays,
        },
        {
          name: "Add Property",
          path: "/landlord/properties/create",
          icon: Plus,
        },
      ];
    }
    if (section === "admin") {
      return [
        { name: "Overview", path: "/admin", icon: LayoutDashboard },
        {
          name: "Properties",
          path: "/admin/properties",
          icon: Building2,
        },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Bookings", path: "/admin/bookings", icon: CalendarDays },
        { name: "Amenities", path: "/admin/amenities", icon: Wrench },
      ];
    }
    return [
      { name: "Overview", path: "/user", icon: LayoutDashboard },
      {
        name: "My Bookings",
        path: "/dashboard/my-bookings",
        icon: CalendarDays,
      },
      {
        name: "Payments",
        path: "/dashboard/my-payments",
        icon: CreditCard,
      },
    ];
  }, [section]);

  // Client-side authentication redirect
  useEffect(() => {
    if (!isLoading && !user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [isLoading, user, pathname, router]);

  // 1. Loading state with brand skeleton to prevent flashing unauthorized content
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-48 rounded-lg" />
              <Skeleton className="h-6 w-96 rounded-lg" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {["1", "2", "3", "4"].map((k) => (
                  <Skeleton key={k} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Unauthenticated fallback
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-24 pb-12">
          <Card className="max-w-md border-border/70 p-6 text-center shadow-lg">
            <CardContent className="space-y-4 pt-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                <Lock className="size-6" />
              </div>
              <h1 className="text-xl font-bold">Sign in required</h1>
              <p className="text-sm text-muted-foreground">
                You must be logged in to view this dashboard page.
              </p>
              <div className="pt-2">
                <Button
                  render={
                    <Link
                      href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    >
                      Sign In Now
                    </Link>
                  }
                  nativeButton={false}
                  className="w-full bg-[#173b28] text-white hover:bg-[#204f37]"
                >
                  Sign In Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Role-Based Access Control Checks
  const isUnauthorizedAdmin = section === "admin" && role !== "ADMIN";
  const isUnauthorizedLandlord =
    section === "landlord" && role !== "LANDLORD" && role !== "ADMIN";

  if (isUnauthorizedAdmin || isUnauthorizedLandlord) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-24 pb-12">
          <Card className="max-w-lg border-amber-200 bg-amber-50/50 p-6 text-center shadow-md dark:border-amber-900/50 dark:bg-amber-950/20">
            <CardContent className="space-y-4 pt-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                <ShieldCheck className="size-6" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Access Restricted
              </h1>
              <p className="text-sm text-muted-foreground">
                {isUnauthorizedAdmin
                  ? "This section is restricted to Room Nest Administrators only."
                  : "This section is reserved for verified Landlords. Your account is currently registered as a Tenant."}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Button
                  render={
                    <Link href={dashboardHome}>Go to Your Dashboard</Link>
                  }
                  nativeButton={false}
                  className="bg-[#173b28] text-white hover:bg-[#204f37]"
                >
                  Go to Your Dashboard
                </Button>
                <Button
                  variant="outline"
                  render={<Link href="/">Return to Home</Link>}
                  nativeButton={false}
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // 4. Authorized View: Navbar + Sub-Nav Bar (Back/Home/Tabs) + Content + Footer
  const sectionTitle =
    section === "landlord"
      ? "Landlord Portal"
      : section === "admin"
        ? "Admin Console"
        : "Tenant Workspace";

  const isSubPage = pathname !== dashboardHome;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Dashboard Sub-Header with Role Badge, Tabs, and Back/Home Navigation */}
      <section className="sticky top-[72px] z-30 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          {/* Left: Role Indicator & Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            >
              {sectionTitle}
            </Badge>

            <nav
              aria-label="Dashboard sections"
              className="flex items-center gap-1 overflow-x-auto py-1"
            >
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                      isActive
                        ? "bg-[#173b28] text-white shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <TabIcon className="size-3.5" />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Back to Dashboard & Go to Home Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isSubPage && (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={dashboardHome}>Dashboard</Link>}
                nativeButton={false}
                className="h-8 gap-1.5 text-xs font-semibold"
                aria-label="Back to role dashboard"
              >
                <ArrowLeft className="size-3.5" />
                <span>Dashboard</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/">Home</Link>}
              nativeButton={false}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              aria-label="Go to home page"
            >
              <Home className="size-3.5" />
              <span>Home</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="flex-1 pb-16">{children}</main>

      <Footer />
    </div>
  );
}
