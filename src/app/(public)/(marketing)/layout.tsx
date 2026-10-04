
import Footer from "@/components/layout/public/Footer";
import Navbar from "@/components/layout/public/Navbar";
import type{ ReactNode } from "react";

const layout = ({children}:{children:ReactNode}) => {
    return (
      <div className="flex flex-col h-screen">
        <Navbar></Navbar>
        <main className="flex-1"> {children}</main>
        <Footer></Footer>
      </div>
    );
};

export default layout;