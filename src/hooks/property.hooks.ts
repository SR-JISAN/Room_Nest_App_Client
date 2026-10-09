import { allProperties } from "@/api/property.api";
import { useQuery } from "@tanstack/react-query";

export function useAllProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: allProperties,
  });
};