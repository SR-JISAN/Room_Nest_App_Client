import apiClient from "@/lib/ofetch";

export const allProperties = () => {
  return apiClient("/api/properties/all-properties");
};