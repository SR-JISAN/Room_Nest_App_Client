import { useQuery } from "@tanstack/react-query";
import { getMyPayments } from "@/api/payment.api";

export function useMyPayments() {
  return useQuery({
    queryKey: ["payments", "mine"],
    queryFn: getMyPayments,
    retry: 1,
  });
}
