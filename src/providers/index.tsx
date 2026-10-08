"use client";

import GoogleAuthProvider from "./GoogleAuthProvider";
import QueryProviders from "./query.providers";



const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <QueryProviders>{children}</QueryProviders>
    </GoogleAuthProvider>
  );
};

export default Providers;
