"use client"
import { LoginForm } from "@/components/form/LoginForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const route = useRouter()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="bg-[#1a3929] flex justify-between px-5 py-4 rounded-lg items-center mb-3">
          <Link className="flex gap-2 justify-center items-end" href="/">
            <Image
              src="/logo.png"
              alt="Room Nest logo"
              width={30}
              height={30}
              className=""
            />
            <h1 className="font-extrabold text-xl bg-linear-to-bl from-green-950 to-green-500 bg-clip-text text-transparent">
              Room{" "}
              <span className="bg-linear-to-br from-green-900 to-green-500 bg-clip-text text-transparent">
                {" "}
                Nest
              </span>
            </h1>
          </Link>
          <Button className="cursor-pointer" onClick={() => route.back()} variant="secondary">
            <ArrowLeft size={20} strokeWidth={2.25} />
            <span className="font-semibold">Back</span>
          </Button>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
