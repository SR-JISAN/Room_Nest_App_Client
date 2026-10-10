"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { useLoggedOut, useUserProfile } from "@/hooks";
import { Profile } from "../userProfile/Profile";

const Navbar = () => {
  const [openMenu, isOpenMenu] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const { data } = useUserProfile();
  const user = data?.data;
  const isLoggedIn = Boolean(user?.id);

  const { mutate: logout } = useLoggedOut();
  const queryClient = useQueryClient();

  const routes = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handelLoggedOut = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(["user"], null);
        queryClient.cancelQueries({ queryKey: ["user"] });
        isOpenMenu(false);
        toast.add({
          title: "Logged Out Successful",
          description: "You have been logged out successfully",
          type: "success",
        });
        if (
          pathName.startsWith("/landlord") ||
          pathName.startsWith("/admin") ||
          pathName.startsWith("/user") ||
          pathName.startsWith("/dashboard") ||
          pathName.startsWith("/profile") ||
          pathName.startsWith("/settings") ||
          pathName.startsWith("/accounts")
        ) {
          router.push("/login");
        }
      },
      onError() {
        toast.add({
          title: "Logged Out Failed",
          description: "Something went wrong while logging out",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="w-full shadow-2xl bg-[#0f1f17] text-white fixed inset-x-0 top-0 z-50">
      <nav className=" py-5 px-6 md:px-4  rounded-2xl flex justify-between mx-auto max-w-7xl gap-5 items-center ">
        <div>
          <Link className="flex gap-2 justify-center items-end" href="/">
            <Image
              src="/logo.png"
              alt="Room Nest logo"
              width={30}
              height={30}
              className=""
            />
            <h1 className="font-extrabold text-xl text-white">
              Room <span className="text-[#a8e6b5]">Nest</span>
            </h1>
          </Link>
        </div>
        <nav className="hidden md:flex lg:flex justify-center items-center gap-4 ">
          {routes.map((route) => {
            const isActive = pathName === route.path;
            return (
              <Link key={route.path} href={route.path}>
                <div
                  className={`
      relative px-2 py-2
      transition-colors duration-500
        ${
          isActive
            ? "text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white after:transition-all after:duration-1000"
            : "text-gray-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white hover:text-white"
        }
      `}
                >
                  {route.name}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Profile />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                render={<Link href="/login">Login</Link>}
                nativeButton={false}
                className="font-bold shadow"
              >
                Login
              </Button>
              <Button
                variant="outline"
                render={<Link href="/register">Register</Link>}
                nativeButton={false}
                className="hidden font-bold sm:inline-flex border-white/20 text-white hover:bg-white/10"
              >
                Register
              </Button>
            </div>
          )}

          {/* Mobile Menu */}

          <Drawer
            open={openMenu}
            onOpenChange={isOpenMenu}
            showSwipeHandle={openMenu}
            swipeDirection={openMenu ? "right" : "right"}
          >
            <DrawerTrigger
              className="block md:hidden lg:hidden"
              aria-label="Open navigation menu"
              render={
                <Button variant="secondary" aria-label="Open navigation menu" />
              }
            >
              {openMenu ? (
                <X size={20} strokeWidth={2.25} />
              ) : (
                <Menu size={20} strokeWidth={2.25} />
              )}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="bg-[#0f1f17] text-white rounded-2xl">
                  <div className="flex justify-between items-center p-2">
                    <Link
                      className="flex gap-2 justify-center items-end"
                      href="/"
                    >
                      <Image
                        src="/logo.png"
                        alt="Room Nest logo"
                        width={30}
                        height={30}
                        className=""
                      />
                      <h1 className="font-extrabold text-xl text-white">
                        Room <span className="text-[#a8e6b5]">Nest</span>
                      </h1>
                    </Link>
                    <DrawerClose
                      className="cursor-pointer"
                      aria-label="Close navigation menu"
                      render={
                        <Button
                          variant="secondary"
                          aria-label="Close navigation menu"
                        />
                      }
                    >
                      <X size={20} strokeWidth={2.25} />
                    </DrawerClose>
                  </div>
                </DrawerTitle>

                <DrawerDescription className="flex flex-col justify-normal items-start gap-3 mt-4 text-sm font-semibold">
                  {routes.map((route) => {
                    const isActive = pathName === route.path;
                    return (
                      <Link
                        className={`w-full ${isActive ? "bg-[#0f1f17] text-white rounded-xl" : ""}`}
                        key={route.path}
                        href={route.path}
                      >
                        <DrawerClose className="w-full py-2.5 rounded-xl shadow hover:shadow-[#0f1f17] cursor-pointer">
                          {route.name}
                        </DrawerClose>
                      </Link>
                    );
                  })}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                {isLoggedIn ? (
                  <div className="flex w-full items-center gap-4">
                    <Button
                      onClick={handelLoggedOut}
                      variant="secondary"
                      className="font-bold w-full bg-[#0f1f17] text-white hover:bg-[#0f1f17] shadow hover:text-red-500 hover:shadow-red-700 cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-full items-center gap-4">
                    <Button
                      className="flex-1 shadow bg-[#0f1f17] text-white hover:bg-[#0f1f17] hover:text-white"
                      variant="secondary"
                      render={<Link href="/login">Login</Link>}
                      nativeButton={false}
                    >
                      Login
                    </Button>
                    <Button
                      className="flex-1 shadow bg-[#0f1f17] text-white hover:bg-[#0f1f17] hover:text-white"
                      variant="secondary"
                      render={<Link href="/register">Register</Link>}
                      nativeButton={false}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
