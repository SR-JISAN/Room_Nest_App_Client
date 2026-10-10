import type { ReactNode } from "react";

import Navbar from "@/components/layout/public/Navbar";
import Footer from "@/components/layout/public/Footer";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar></Navbar>
      <main className="flex-1"> {children}</main>
     <Footer/>
    </div>
  );
};

export default layout;
