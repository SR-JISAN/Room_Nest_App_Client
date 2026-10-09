"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AccountsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-5xl space-y-7"
    >
      <div>
        <Button variant="ghost" className="-ml-3 mb-3 text-muted-foreground">
          <Link href="/settings">
            <ArrowLeft className="mr-2 size-4" />
            Back to settings
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Account settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Manage your personal information and account security.
        </p>
      </div>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-600/10">
            <UserRound className="size-6 text-emerald-600" />
          </div>

          <CardTitle className="mt-3">Personal information</CardTitle>
          <CardDescription>
            Your account profile and contact information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 hover:shadow cursor-pointer">
          <AccountItem
            icon={UserRound}
            title="Profile details"
            description="Manage your name, phone number and personal details."
          />

          <AccountItem
            icon={Mail}
            title="Email address"
            description="Review your registered email address and verification status."
          />
          <Link href="/resetPassword">
            <AccountItem
              icon={ShieldCheck}
              title="Security"
              description="Manage password and account security options."
            />
          </Link>

          <div className="pt-2 cursor-pointer">
            <Button className="w-full rounded-xl sm:w-auto">
              <Link href="/profile">Edit profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function AccountItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/70 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default AccountsPage;
