import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type AddReviewPayload,
  addReview,
  deleteReview,
  updateReview,
} from "@/api/review.api";

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      payload,
    }: {
      roomId: string;
      payload: AddReviewPayload;
    }) => addReview(roomId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["property-details"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
      ]);
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      payload,
    }: {
      roomId: string;
      payload: Partial<AddReviewPayload>;
    }) => updateReview(roomId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["property-details"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
      ]);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => deleteReview(roomId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["property-details"] }),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
      ]);
    },
  });
}
