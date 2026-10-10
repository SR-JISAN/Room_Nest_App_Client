"use client";

import GoogleAuthProvider from "./GoogleAuthProvider";
import QueryProviders from "./query.providers";
import { ThemeProvider } from "./theme.provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <GoogleAuthProvider>
        <QueryProviders>{children}</QueryProviders>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
