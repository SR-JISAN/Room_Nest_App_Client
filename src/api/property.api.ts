import apiClient from "@/lib/ofetch";
import type { Property } from "@/types/property.type";

export type PropertyListParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  propertyType?: string;
};

export type PropertyListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    result: Property[];
    Meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type PropertyAmenity = { id: string; amenityName: string };
export type CreatePropertyPayload = {
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  latitude: string;
  longitude: string;
  propertyType: string;
  amenities: string[];
  rooms: Array<{
    roomTitle: string;
    roomDescription: string;
    rentAmount: number;
    subRentAmount: number;
    securityDeposit: number;
    roomType: string;
    maxRoommates: number;
    amenities: string[];
  }>;
};

export async function getPropertyAmenities() {
  const response = await apiClient<{ data: PropertyAmenity[] }>(
    "/api/amenities/get-amenities",
  );
  return response.data;
}

export async function createProperty(
  payload: CreatePropertyPayload,
  images: File[],
) {
  const body = new FormData();
  body.set("data", JSON.stringify(payload));
  for (const image of images) body.append("property_images", image);
  return apiClient<{ data: Property }>("/api/properties/create-properties", {
    method: "POST",
    body,
  });
}

export const allProperties = (params: PropertyListParams = {}) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }

  return apiClient<PropertyListResponse>(
    `/api/properties/all-properties${query.size ? `?${query.toString()}` : ""}`,
  );
};

export const myProperties = async (page = 1, limit = 20) =>
  apiClient<PropertyListResponse>(
    `/api/properties/my-properties?page=${page}&limit=${limit}`,
  );

export const myPropertyDetails = async (
  propertyId: string,
): Promise<Property> => {
  const response = await apiClient<{ data: Property }>(
    `/api/properties/my-properties/${encodeURIComponent(propertyId)}`,
  );
  return response.data;
};

export const deleteProperty = async (propertyId: string) =>
  apiClient(
    `/api/properties/delete-property/${encodeURIComponent(propertyId)}`,
    {
      method: "DELETE",
    },
  );

export type UpdatePropertyPayload = {
  title?: string;
  description?: string;
  address?: string;
  area?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  propertyType?: string;
};

export type UpdateRoomPayload = {
  title?: string;
  description?: string;
  rentAmount?: number;
  subRentAmount: number;
  securityDeposit?: number;
  roomType?: string;
  maxRoommates?: number;
};

export const updateProperty = (
  propertyId: string,
  payload: UpdatePropertyPayload,
) =>
  apiClient(
    `/api/properties/update-properties/${encodeURIComponent(propertyId)}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

export const updateRoom = (
  propertyId: string,
  roomId: string,
  payload: UpdateRoomPayload,
) =>
  apiClient(
    `/api/properties/update-room/${encodeURIComponent(propertyId)}/${encodeURIComponent(roomId)}`,
    { method: "PATCH", body: payload },
  );

export const uploadRoomImages = (
  propertyId: string,
  roomId: string,
  images: File[],
) => {
  const body = new FormData();
  for (const image of images) body.append("rooms_images", image);
  return apiClient(
    `/api/properties/create-room-images/${encodeURIComponent(propertyId)}/${encodeURIComponent(roomId)}`,
    { method: "POST", body },
  );
};

export const updateRoomImage = (
  propertyId: string,
  roomId: string,
  roomImageId: string,
  image: File,
) => {
  const body = new FormData();
  body.append("rooms_images", image);
  return apiClient(
    `/api/properties/update-room-images/${encodeURIComponent(propertyId)}/${encodeURIComponent(roomId)}/${encodeURIComponent(roomImageId)}`,
    { method: "PATCH", body },
  );
};

export const updatePropertyImage = (
  propertyId: string,
  propertyImageId: string,
  image: File,
) => {
  const body = new FormData();
  body.append("property_images", image);
  return apiClient(
    `/api/properties/update-property-images/${encodeURIComponent(propertyId)}/${encodeURIComponent(propertyImageId)}`,
    { method: "PATCH", body },
  );
};
interface PropertyDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Property;
}

export const propertyDetails = async (
  propertyId: string,
): Promise<Property> => {
  const response = await apiClient<PropertyDetailsResponse>(
    `/api/properties/${encodeURIComponent(propertyId)}`,
  );

  return response.data;
};
