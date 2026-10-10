import apiClient from "@/lib/ofetch";

export type ReviewRating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";

export type ReviewRecord = {
  id: string;
  name: string;
  email: string;
  note: string;
  reviewRating: ReviewRating;
  roomId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type AddReviewPayload = {
  note: string;
  reviewRating: ReviewRating;
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

export async function addReview(roomId: string, payload: AddReviewPayload) {
  const response = await apiClient<ApiResponse<ReviewRecord>>(
    `/api/reviews/add-review/${encodeURIComponent(roomId)}`,
    {
      method: "POST",
      body: payload,
    },
  );
  return response.data;
}

export async function updateReview(
  roomId: string,
  payload: Partial<AddReviewPayload>,
) {
  const response = await apiClient<ApiResponse<ReviewRecord>>(
    `/api/reviews/update-review/${encodeURIComponent(roomId)}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
  return response.data;
}

export async function deleteReview(roomId: string) {
  const response = await apiClient<ApiResponse<ReviewRecord>>(
    `/api/reviews/add-review/${encodeURIComponent(roomId)}`,
    {
      method: "DELETE",
    },
  );
  return response.data;
}
