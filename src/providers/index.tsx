"use client";

import QueryProviders from "./query.providers";



const Providers = ({ children }: { children: React.ReactNode }) => {
  return <QueryProviders>{children}</QueryProviders>;
};

export default Providers;
