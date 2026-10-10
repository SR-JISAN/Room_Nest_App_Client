import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Navbar from "@/components/layout/public/Navbar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
