"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Globe,
  Mail,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const SettingsPage = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-5xl space-y-7"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-emerald-600" />
            <Badge variant="secondary">Preferences</Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Customize your Room Nest experience and manage your preferences.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-fit rounded-xl hover:shadow cursor-pointer"
          onClick={() => window.location.assign("/accounts")}
        >
          Manage account
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="size-5 text-emerald-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to receive updates from Room Nest.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <PreferenceRow
              icon={Mail}
              title="Email notifications"
              description="Receive important updates and account information."
              defaultChecked
            />

            <Separator />

            <PreferenceRow
              icon={Bell}
              title="Booking updates"
              description="Get notified about booking status and changes."
              defaultChecked
            />

            <Separator />

            <PreferenceRow
              icon={ShieldCheck}
              title="Security alerts"
              description="Receive alerts about important account activity."
              defaultChecked
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* General preferences */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="size-5 text-emerald-600" />
              General preferences
            </CardTitle>
            <CardDescription>
              Adjust your display and regional preferences.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <PreferenceRow
              icon={Moon}
              title="Appearance"
              description="Dark mode preference. Theme integration can be connected here."
              badge="Coming soon"
            />

            <Separator />

            <PreferenceRow
              icon={Globe}
              title="Language and region"
              description="Choose your preferred language and regional format."
              badge="English"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-border/70 shadow-sm ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="size-5 text-emerald-600" />
              Account and security
            </CardTitle>
            <CardDescription>
              Keep your Room Nest account details up to date.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium">Personal information</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your profile and account information.
                </p>
              </div>

              <Button variant="outline" className="rounded-xl">
                <a href="/settings/accounts">
                  View account
                  <ChevronRight className="ml-1 size-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="pb-4 text-center text-xs text-muted-foreground"
      >
        Room Nest settings · Your comfort, your control.
      </motion.p>
    </motion.div>
  );
};

function PreferenceRow({
  icon: Icon,
  title,
  description,
  defaultChecked,
  badge,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  defaultChecked?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
          {badge && (
            <Badge variant="secondary" className="mt-2">
              {badge}
            </Badge>
          )}
        </div>
      </div>

      {typeof defaultChecked === "boolean" ? (
        <Switch
          defaultChecked={defaultChecked}
          aria-label={title}
          className="shrink-0"
        />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </div>
  );
}

export default SettingsPage;
