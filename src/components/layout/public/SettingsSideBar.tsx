"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  House,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SettingsSideBarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

const navigationItems = [
  {
    title: "Settings",
    description: "Preferences and notifications",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Accounts",
    description: "Manage your profile",
    href: "/accounts",
    icon: UserRound,
  },
];

const SettingsSideBar = ({
  collapsed,
  onToggle,
  mobile = false,
}: SettingsSideBarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isCollapsed = collapsed && !mobile;

  return (
    <aside
      className={cn(
        "relative flex min-h-full w-full flex-col bg-background p-3 sm:p-4",
        mobile ? "min-h-screen" : "h-full",
      )}
    >
      {/* Logo and Actions */}
      <div className="flex min-h-10 items-center justify-between gap-2">
        <Link
          href="/"
          onClick={mobile ? onToggle : undefined}
          title={isCollapsed ? "Room Nest home" : undefined}
          className={cn(
            "flex min-w-0 items-center gap-2.5 overflow-hidden",
            isCollapsed && "justify-center",
          )}
        >
          <Image
            src="/logo.png"
            alt="Room Nest logo"
            width={36}
            height={36}
            priority
            className="size-9 shrink-0 object-contain"
          />

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-xl font-extrabold tracking-tight"
              >
                Room <span className="text-emerald-600">Nest</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            onClick={() => router.back()}
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="size-4" />
          </Button>

          {mobile && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg"
              onClick={onToggle}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Collapse Toggle */}
      {!mobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-19 z-20 hidden size-7 rounded-full bg-background shadow-sm md:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      )}

      {/* Workspace */}
      <div
        title={isCollapsed ? "Your space" : undefined}
        className={cn(
          "mt-6 flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-600/10 p-3",
          isCollapsed && "justify-center px-0",
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <House className="size-5" />
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
            >
              <p className="text-sm font-semibold">Your space</p>
              <p className="text-xs text-muted-foreground">
                Manage your Room Nest
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="my-5" />

      {!isCollapsed && (
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Preferences
        </p>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/settings"
              ? pathname === "/settings"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={mobile ? onToggle : undefined}
              title={isCollapsed ? item.title : undefined}
              aria-label={item.title}
              aria-current={isActive ? "page" : undefined}
              className="block min-w-0"
            >
              <motion.div
                whileHover={{ x: isCollapsed ? 0 : 3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "relative flex min-w-0 items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors",
                  isCollapsed && "justify-center px-0",
                  isActive
                    ? "border-emerald-600/15 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="settings-active-indicator"
                    className="absolute inset-y-2 left-0 w-1 rounded-full bg-emerald-600"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <Icon className="size-5 shrink-0" />

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isCollapsed && (
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0",
                      isActive && "text-emerald-600",
                    )}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <Separator className="mb-4" />

        {!isCollapsed ? (
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Need some help?</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Manage your account and personalize your Room Nest experience.
            </p>

            <Button
             
              variant="outline"
              className="mt-3 w-full rounded-xl"
            >
              <Link href="/" onClick={mobile ? onToggle : undefined}>
                Back to home
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            title="Back to home"
          >
            <Link href="/">
              <House className="size-5" />
            </Link>
          </Button>
        )}

        {!isCollapsed && (
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Room Nest · Your trusted nest
          </p>
        )}
      </div>
    </aside>
  );
};

export default SettingsSideBar;
