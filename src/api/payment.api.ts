import apiClient from "@/lib/ofetch";

export type PaymentRecord = {
  id: string;
  amount: number | string;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentType: string;
  merchantInvoiceNumber?: string;
  bkashTrxID?: string | null;
  paidAt?: string | null;
  createdAt: string;
  booking?: { id: string } | null;
  subBooking?: { id: string } | null;
};

export async function getMyPayments() {
  const response = await apiClient<{
    data: PaymentRecord[];
    meta?: { page: number; limit: number; total: number; totalPage: number };
  }>(
    "/api/payments/my-payments?limit=25&page=1&sortBy=createdAt&sortOrder=desc",
  );
  return response;
}
