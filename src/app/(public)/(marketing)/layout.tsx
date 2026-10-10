import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Navbar from "@/components/layout/public/Navbar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
