"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useLoggedOut, useUserProfile } from "@/hooks";

export function Profile() {
  const { data, isLoading } = useUserProfile();
  const user = data?.data;

  const { mutate: logout } = useLoggedOut();
  const queryClient = useQueryClient();

  const getInitials = (name?: string) => {
    if (!name?.trim()) return "U";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);

  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />;
  }

  const handelLoggedOut = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(["user"], null);
        toast.add({
          title: "Logged Out Successful",
          description: "You Logged Out Successfully",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError() {
        toast.add({
          title: "Logged Out Failed",
          description: "Something went wrong",
          type: "error",
        });
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="h-10 w-10 cursor-pointer border-2 border-background shadow-sm transition-transform hover:scale-105">
          <AvatarImage src={user?.imageURL || ""} alt={user?.name || "User"} />

          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl p-2"
      >
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage
              src={user?.imageURL || ""}
              alt={user?.name || "User"}
            />

            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{user?.name || "User"}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-3 rounded-lg py-2.5"
          render={<Link href="/profile" />}
        >
          <UserRound className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        {user?.role === "ADMIN" && (
          <DropdownMenuItem
            className="cursor-pointer gap-3 rounded-lg py-2.5"
            render={<Link href="/admin" />}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}

        {user?.role === "LANDLORD" && (
          <DropdownMenuItem
            className="cursor-pointer gap-3 rounded-lg py-2.5"
            render={<Link href="/landlord" />}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Landlord Dashboard</span>
          </DropdownMenuItem>
        )}

        {user?.role === "USER" && (
          <>
            <DropdownMenuItem
              className="cursor-pointer gap-3 rounded-lg py-2.5"
              render={<Link href="/user" />}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>User Dashboard</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer gap-3 rounded-lg py-2.5"
              render={<Link href="/dashboard/my-bookings" />}
            >
              <CalendarDays className="h-4 w-4" />
              <span>My Bookings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer gap-3 rounded-lg py-2.5"
              render={<Link href="/dashboard/my-payments" />}
            >
              <CreditCard className="h-4 w-4" />
              <span>My Payments</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer gap-3 rounded-lg py-2.5"
          render={<Link href="/settings" />}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handelLoggedOut}
          className="cursor-pointer gap-3 rounded-lg py-2.5 text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
