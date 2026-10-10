import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  createBooking,
  getBookings,
  initiateBookingPayment,
  rejectBooking,
} from "@/api/booking.api";

export function useBookings() {
  return useQuery({
    queryKey: ["booking", "list"],
    queryFn: getBookings,
    retry: 1,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["booking"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "user"] }),
      ]);
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["booking"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "user"] }),
      ]);
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["booking"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "landlord"] }),
      ]);
    },
  });
}

export function useInitiateBookingPayment() {
  return useMutation({ mutationFn: initiateBookingPayment });
}

export function useMySubBookings() {
  return useQuery({
    queryKey: ["sub-booking", "my-requests"],
    queryFn: () =>
      import("@/api/booking.api").then((mod) => mod.getMySubBookings()),
    retry: 1,
  });
}

export function useSubBookingRequests() {
  return useQuery({
    queryKey: ["sub-booking", "all-requests"],
    queryFn: () =>
      import("@/api/booking.api").then((mod) => mod.getSubBookingRequests()),
    retry: 1,
  });
}

export function useCreateSubRoomBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: import("@/api/booking.api").CreateSubRoomBookingPayload,
    ) =>
      import("@/api/booking.api").then((mod) =>
        mod.createSubRoomBooking(payload),
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sub-booking"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "user"] }),
      ]);
    },
  });
}

export function useCancelSubBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      import("@/api/booking.api").then((mod) => mod.cancelSubBooking(id)),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sub-booking"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "user"] }),
      ]);
    },
  });
}

export function useDeleteSubBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      import("@/api/booking.api").then((mod) => mod.deleteSubBooking(id)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sub-booking"] });
    },
  });
}

export function useUpdateSubBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "REJECTED";
    }) =>
      import("@/api/booking.api").then((mod) =>
        mod.updateSubBooking(id, status),
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sub-booking"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
  });
}

export function useInitiateSubBookingPayment() {
  return useMutation({
    mutationFn: (id: string) =>
      import("@/api/booking.api").then((mod) =>
        mod.initiateSubBookingPayment(id),
      ),
  });
}
