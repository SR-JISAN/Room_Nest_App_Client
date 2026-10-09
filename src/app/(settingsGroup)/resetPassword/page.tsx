"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdatePasswordForm from "@/components/form/UpdatePasswordFrom";

type PasswordFieldName = "currentPassword" | "newPassword" | "confirmPassword";

const ResetPassword = () => {
  

  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<PasswordFieldName, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

 

  const togglePassword = (name: PasswordFieldName) => {
    setVisiblePasswords((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  return (
    <div className="flex w-full items-start justify-center py-4 sm:py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        {/* Page heading */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="-ml-3 mb-5 rounded-xl text-muted-foreground"
          >
            <Link href="/accounts">
              <ArrowLeft className="mr-2 size-4" />
              Back to account
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
              <LockKeyhole className="size-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Reset password
              </h1>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Protect your Room Nest account with a strong password.
              </p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="border-b border-border/60 bg-muted/20 p-5 sm:p-7">
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="size-5 text-emerald-600" />
              Change your password
            </CardTitle>

            <CardDescription className="leading-6">
              Enter your current password and choose a new one to secure your
              account.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-7">
            <UpdatePasswordForm />
            <div className="flex items-start gap-3 rounded-xl bg-emerald-600/5 p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-semibold">
                  Keep your account secure
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Choose a unique password that you do not use for other
                  accounts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
          Room Nest · Your trusted nest
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
