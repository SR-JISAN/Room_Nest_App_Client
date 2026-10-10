import apiClient from "@/lib/ofetch";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  emailVerified: boolean;
  createdAt: string;
};

export type AdminProperty = {
  id: string;
  title: string;
  address: string;
  area: string;
  city: string;
  description: string;
  propertyType: string;
  propertyStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  users: { id: string; name: string; email: string };
  rooms: Array<{ id: string; title: string; roomStatus: string }>;
};

export type AdminPage<T> = {
  result: T[];
  Meta: { page: number; limit: number; total: number; totalPages: number };
};

type ApiResponse<T> = { data: T };

export async function getAdminUsers(page: number) {
  const response = await apiClient<ApiResponse<AdminPage<AdminUser>>>(
    `/api/users/admin-users?page=${page}&limit=20`,
  );
  return response.data;
}

export async function changeAdminUserStatus(
  userId: string,
  status: "ACTIVE" | "BLOCKED",
) {
  return apiClient(
    `/api/users/admin-users/${encodeURIComponent(userId)}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}

export async function getAdminProperties(page: number, status: string) {
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (status !== "ALL") query.set("status", status);
  const response = await apiClient<ApiResponse<AdminPage<AdminProperty>>>(
    `/api/properties/admin-properties?${query}`,
  );
  return response.data;
}

export async function changeAdminPropertyStatus(
  propertyId: string,
  status: AdminProperty["propertyStatus"],
) {
  return apiClient(
    `/api/properties/admin-properties/${encodeURIComponent(propertyId)}/status`,
    { method: "PATCH", body: { status } },
  );
}

export async function addAdminAmenity(amenityName: string) {
  return apiClient("/api/amenities/add-amenities", {
    method: "POST",
    body: { amenityName },
  });
}

export async function deleteAdminAmenity(amenityName: string) {
  return apiClient("/api/amenities/delete-amenities", {
    method: "DELETE",
    body: { amenityName },
  });
}
