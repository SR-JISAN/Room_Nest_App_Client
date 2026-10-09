"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile } from "@/hooks";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Mail, MapPin, Pencil, Phone, User, UserStar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import UpdateProfileForm from "@/components/form/UpdateProfileForm";
import { useRouter } from "next/navigation";





export default function ProfilePage() {
const route= useRouter()
const { data, isLoading } = useUserProfile();
const [open, setOpen] = useState(false);
if (isLoading) {
  return (
    <section className="container mx-auto w-full py-8">
      <div className="flex min-h-100 flex-col items-center justify-center">
        
        <div className="relative flex h-16 w-16 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-4 border-muted border-t-[#1a3929]"
          />

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a3929]">
             <Image
               src="/logo.png"
               alt="Room Nest"
               width={45}
               height={45}
               priority
               />
          </div>
        </div>

      
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 text-center"
        >
          <h2 className="text-lg font-semibold">Loading your profile</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Please wait while we fetch your account information.
          </p>
        </motion.div>

      
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.15,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#1a3929]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
const user = data?.data;
  console.log(user);
if (!user) {
  return (
    <section className="container mx-auto flex min-h-100 items-center justify-center">
      <p className="text-muted-foreground">
        Unable to load profile information.
      </p>
    </section>
  );
};
  return (
    <section className="container w-full mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{user?.name} Profile</h1>

        <p className="text-muted-foreground">
          View and manage your account information.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-8">
            {user.imageURL ? (
              <Image
                src={user.imageURL}
                alt={user.name}
                width={120}
                height={120}
                className="rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-30 w-30 items-center justify-center rounded-full border bg-muted text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex items-end gap-3">
              <h2 className="mt-5 text-2xl font-bold">{user.name}</h2>
              <Badge className="mt-4">
                {user.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>

            <p className="text-muted-foreground">{user.email}</p>

            <div className="flex justify-evenly items-end gap-5">
              <Badge className="mt-4">{user.role}</Badge>

              <Badge
                variant={user.status === "ACTIVE" ? "default" : "destructive"}
                className="mt-2"
              >
                {user.status}
              </Badge>
            </div>
            <div className="flex gap-2 items-center pt-5">
              <p className="text-sm text-muted-foreground">Address : </p>

              <p className="font-medium">
                {user?.profiles?.address || "Not Added"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="flex gap-3 items-center shadow py-3 px-2 rounded-lg border-2 hover:bg-[#0f1f17] font-bold  hover:text-white">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </DialogTrigger>

                <DialogContent
                  className="flex max-h-[90dvh] 
       flex-col gap-0 overflow-hidden sm:max-w-[calc(100%-2rem)]  sm:overflow-visible
      rounded-xl p-0 sm:w-[calc(100%-2rem)] border-2"
                >
                  <DialogHeader className="shrink-0 border-b p-4 sm:p-6">
                    <DialogTitle>Update Your Profile</DialogTitle>
                  </DialogHeader>
                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <UpdateProfileForm onClose={() => setOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>

                  <p className="font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>

                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>

                  <p className="font-medium">
                    {user?.profiles?.contactNumber || "Not Added"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <UserStar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>

                  <p className="font-medium">
                    {user?.profiles?.occupation || "Not Added"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CalendarDays className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>

                  <p className="font-medium">
                    {user?.profiles?.dateOfBirth
                      ? new Date(user.profiles.dateOfBirth).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Not Added"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-primary" />

                  <div>
                    <p className="text-sm text-muted-foreground">BIO</p>

                    <p className="font-medium">
                      {user?.profiles?.bio || "Not Added"}
                    </p>
                  </div>
                </div>
                <Button
                  className="cursor-pointer"
                  onClick={() => route.back()}
                  variant="secondary"
                >
                  <ArrowLeft size={20} strokeWidth={2.25} />
                  <span className="font-semibold">Back</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
