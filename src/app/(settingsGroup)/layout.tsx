"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";

import SettingsSideBar from "@/components/layout/public/SettingsSideBar";
import { Button } from "@/components/ui/button";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur md:hidden">
        <Button
          variant="outline"
          size="icon"
          aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        <p className="text-lg font-extrabold tracking-tight">
          Room <span className="text-emerald-600">Nest</span>
        </p>

        <div className="size-9" />
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1600px] md:min-h-screen">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 80 : 288 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative hidden shrink-0 border-r border-border/70 md:block"
        >
          <div className="sticky top-0 h-screen overflow-y-auto overflow-x-hidden">
            <SettingsSideBar
              collapsed={collapsed}
              mobile={false}
              onToggle={() => setCollapsed((prev) => !prev)}
            />
          </div>
        </motion.aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close sidebar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 cursor-default bg-black/50 md:hidden"
              />

              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-y-0 left-0 z-50 w-[min(288px,85vw)] overflow-y-auto border-r border-border/70 bg-background shadow-xl md:hidden"
              >
                <SettingsSideBar
                  collapsed={false}
                  mobile
                  onToggle={() => setMobileOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
};

export default SettingsLayout;
