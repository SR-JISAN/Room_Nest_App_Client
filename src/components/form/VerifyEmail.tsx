import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FetchError } from "ofetch";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyEmail } from "@/hooks";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const Resend_Timer = 120;
const TIMER_KEY = "verify-email-resend-timer";

export function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timeOut, setTimeOut] = useState(Resend_Timer);
  const [isInvalid, setIsInvalid] = useState(false);
  const { mutate: verifyEmailData, isPending } = useVerifyEmail();
  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router.push]);

  useEffect(() => {
    const savedExpiry = localStorage.getItem(TIMER_KEY);

    if (savedExpiry) {
      const remaining = Math.ceil((Number(savedExpiry) - Date.now()) / 1000);

      setTimeOut(Math.max(remaining, 0));
    } else {
      const expiry = Date.now() + Resend_Timer * 1000;

      localStorage.setItem(TIMER_KEY, expiry.toString());
      setTimeOut(Resend_Timer);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const expiry = localStorage.getItem(TIMER_KEY);

      if (!expiry) {
        setTimeOut(0);
        return;
      }

      const remaining = Math.ceil((Number(expiry) - Date.now()) / 1000);

      if (remaining <= 0) {
        setTimeOut(0);
        localStorage.removeItem(TIMER_KEY);
        clearInterval(timer);
      } else {
        setTimeOut(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtp = () => {
    if (otp.length !== 6) {
      toast.add({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        type: "error",
      });
      setIsInvalid(true);
      return;
    }

    const otpData = {
      email,
      otp,
    };

    verifyEmailData(otpData, {
      onSuccess: (_res) => {
        toast.add({
          title: "Email Verified Successfully",
          description: "Welcome to room nest.Your registration completed.",
          type: "success",
        });
        router.push("/");
      },
      onError: (err) => {
        const error = err as FetchError<{ message?: string }>;
        toast.add({
          title: "Email verification failed",
          description:
            error.data?.message ||
            error.message ||
            "Invalid or expired verification code.",
          type: "error",
        });
      },
    });
  };

  if (!email) {
    return null;
  }
  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="font-semibold text-xl">
          Verify your Email
        </CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{" "}
          <span className="font-medium">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between">
            <Field data-invalid={isInvalid}>
              <FieldLabel
                className="font-semibold text-xl"
                htmlFor="otp-verification"
              >
                Verification code
              </FieldLabel>
            </Field>
            <Button disabled={timeOut > 0} variant="outline" size="lg">
              <RefreshCwIcon />
              Resend Code
            </Button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOtp();
            }}
          >
            <Field data-invalid={isInvalid}>
              <InputOTP
                onChange={(value) => {
                  setOtp(value);
                  if (isInvalid) {
                    setIsInvalid(false);
                  }
                }}
                maxLength={6}
                id="otp-verification"
                autoComplete="off"
                name="otp-verification"
                value={otp}
                pattern={REGEXP_ONLY_DIGITS}
                required
              >
                <InputOTPGroup
                  className="*:data-[slot=input-otp-slot]:h-20 *:data-[slot=input-otp-slot]:w-20 *:data-[slot=input-otp-slot]:text-xl 
               *:data-[slot=input-otp-slot]:font-semibold  *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border-3*:data-
               [slot=input-otp-slot]:shadow*:data-
               [slot=input-otp-slot]:focus:outline-none *:data-[slot=input-otp-slot]:focus:ring-2 *:data-[slot=input-otp-slot]:focus:ring-green-500 *:data-[slot=input-otp-slot]:focus:ring-offset-2 *:data-[slot=input-otp-slot]:focus:ring-offset-[#0f1f17]"
                >
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {isInvalid && (
                <FieldDescription className="text-red-500">
                  Invalid OTP. Provide Valid OTP.
                </FieldDescription>
              )}
            </Field>

            <Field className="mt-5">
              <FieldDescription
                className={`${timeOut < 20 ? "text-red-600" : ""} font-bold`}
              >
                Resend OTP in : {timeOut}
              </FieldDescription>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </Field>
          </form>
          <FieldDescription>
            <Link href="/register">
              I no longer have access to this email address.
            </Link>
          </FieldDescription>
          <div className="text-sm text-muted-foreground">
            Having trouble signing in?{" "}
            <a
              href="#"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact support
            </a>
          </div>
        </Field>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
