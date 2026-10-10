import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAdminAmenity,
  changeAdminPropertyStatus,
  changeAdminUserStatus,
  deleteAdminAmenity,
  getAdminProperties,
  getAdminUsers,
} from "@/api/admin.api";
import { getPropertyAmenities } from "@/api/property.api";

export function useAdminUsers(page: number) {
  return useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => getAdminUsers(page),
    retry: 1,
  });
}

export function useChangeAdminUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "ACTIVE" | "BLOCKED";
    }) => changeAdminUserStatus(userId, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useAdminProperties(page: number, status: string) {
  return useQuery({
    queryKey: ["admin", "properties", page, status],
    queryFn: () => getAdminProperties(page, status),
    retry: 1,
  });
}

export function useChangeAdminPropertyStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      status,
    }: {
      propertyId: string;
      status: "APPROVED" | "REJECTED";
    }) => changeAdminPropertyStatus(propertyId, status),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "properties"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
      ]),
  });
}

export function useAdminAmenities() {
  return useQuery({
    queryKey: ["admin", "amenities"],
    queryFn: getPropertyAmenities,
    retry: 1,
  });
}

export function useManageAdminAmenity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      action,
      name,
    }: {
      action: "add" | "delete";
      name: string;
    }) => (action === "add" ? addAdminAmenity(name) : deleteAdminAmenity(name)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "amenities"] }),
  });
}
