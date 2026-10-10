import apiClient from "@/lib/ofetch";

export type CreateBookingPayload = {
  roomId: string;
  occupantCount: number;
  startDate: string;
  endDate?: string;
  note?: string;
};

export type BookingRecord = {
  id: string;
  status: string;
  occupantCount: number;
  rentAmount: number | string;
  securityDeposit: number | string;
  totalAmount: number | string;
  startDate: string;
  endDate?: string | null;
  createdAt?: string;
  room?: {
    id: string;
    title: string;
    property?: { id: string; title: string; city?: string };
  };
  payments?: Array<{
    id: string;
    amount: number | string;
    paymentStatus: string;
    paymentType: string;
    bkashPaymentID?: string | null;
  }>;
  user?: { id: string; name: string; imageURL?: string | null };
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

export async function createBooking(payload: CreateBookingPayload) {
  const response = await apiClient<ApiResponse<BookingRecord>>(
    "/api/booking/create-booking",
    { method: "POST", body: payload },
  );
  return response.data;
}

export async function getBookings() {
  const response = await apiClient<ApiResponse<BookingRecord[]>>(
    "/api/booking/get-booking",
  );
  return response.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await apiClient<ApiResponse<BookingRecord>>(
    `/api/booking/cancel-booking/${encodeURIComponent(bookingId)}`,
    { method: "PATCH" },
  );
  return response.data;
}

export async function rejectBooking(bookingId: string) {
  const response = await apiClient<ApiResponse<BookingRecord>>(
    `/api/booking/reject-booking/${encodeURIComponent(bookingId)}`,
    { method: "PATCH" },
  );
  return response.data;
}

export async function initiateBookingPayment(bookingId: string) {
  const response = await apiClient<ApiResponse<{ bkashURL: string }>>(
    `/api/booking/${encodeURIComponent(bookingId)}/pay`,
    { method: "POST" },
  );
  return response.data;
}

export type CreateSubRoomBookingPayload = {
  name: string;
  age: number;
  gender: "MALE" | "FEMALE";
  roomId: string;
  occupantCount: number;
  startDate: string;
  endDate?: string;
  note?: string;
  imageURL?: string;
};

export type SubBookingRecord = {
  id: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE";
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "CONFIRMED";
  occupantCount: number;
  startDate: string;
  endDate?: string | null;
  subRentAmount?: number | string | null;
  createdAt?: string;
  room?: {
    id: string;
    title: string;
    rentAmount?: number | string;
    subRentAmount?: number | string | null;
    property?: { id: string; title: string; city?: string };
  };
  payments?: Array<{
    id: string;
    amount: number | string;
    paymentStatus: string;
    paymentType: string;
    bkashPaymentID?: string | null;
  }>;
  user?: { id: string; name: string; email?: string; imageURL?: string | null };
};

export async function createSubRoomBooking(
  payload: CreateSubRoomBookingPayload,
) {
  const response = await apiClient<ApiResponse<SubBookingRecord>>(
    "/api/sub/booking/request-sub-room-booking",
    { method: "POST", body: payload },
  );
  return response.data;
}

export async function getMySubBookings() {
  try {
    const response = await apiClient<ApiResponse<SubBookingRecord[]>>(
      "/api/sub/booking/get-my-request",
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { status?: number } };
    if (error.response?.status === 404) return [];
    throw err;
  }
}

export async function getSubBookingRequests() {
  try {
    const response = await apiClient<
      ApiResponse<
        Array<{
          bookingId: string;
          room: { id: string; title: string };
          requests: SubBookingRecord[];
        }>
      >
    >("/api/sub/booking/get-request");
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { status?: number } };
    if (error.response?.status === 404) return [];
    throw err;
  }
}

export async function cancelSubBooking(subBookingId: string) {
  const response = await apiClient<ApiResponse<SubBookingRecord>>(
    `/api/sub/booking/cancel-request/${encodeURIComponent(subBookingId)}`,
    { method: "PATCH" },
  );
  return response.data;
}

export async function deleteSubBooking(subBookingId: string) {
  const response = await apiClient<ApiResponse<SubBookingRecord>>(
    `/api/sub/booking/delete-booking/${encodeURIComponent(subBookingId)}`,
    { method: "DELETE" },
  );
  return response.data;
}

export async function updateSubBooking(
  subBookingId: string,
  status: "ACCEPTED" | "REJECTED",
) {
  const response = await apiClient<ApiResponse<SubBookingRecord>>(
    `/api/sub/booking/update-request/${encodeURIComponent(subBookingId)}`,
    { method: "PATCH", body: { status } },
  );
  return response.data;
}

export async function initiateSubBookingPayment(subBookingId: string) {
  const response = await apiClient<ApiResponse<{ bkashURL: string }>>(
    `/api/sub/booking/pay/${encodeURIComponent(subBookingId)}`,
    { method: "POST" },
  );
  return response.data;
}
