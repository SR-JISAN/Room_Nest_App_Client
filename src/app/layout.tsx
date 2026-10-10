import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Room Nest",
  description: "Find your trusted Nest",
};

const themeScript = `(function(){try{var t=localStorage.getItem('room-nest-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: inline theme initialization to prevent flash
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-full">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
