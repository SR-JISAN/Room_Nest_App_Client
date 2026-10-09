// import { ofetch } from "ofetch";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// const apiClient = ofetch.create({
//   baseURL: BASE_URL,
//   credentials: "include",
//   retry: false,
// });

// export default apiClient;

import { ofetch, type FetchOptions } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const rawApiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  retry: false,
});

type ApiOptions = FetchOptions<"json">;

let refreshPromise: Promise<unknown> | null = null;

const refreshAccessToken = (): Promise<unknown> => {
  if (!refreshPromise) {
    refreshPromise = rawApiClient("/api/auth/refresh-token", {
      method: "POST",
    }).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const apiClient = async <T = unknown>(
  request: string,
  options: ApiOptions = {},
): Promise<T> => {
  try {
    return await rawApiClient<T>(request, options);
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number };
    };

    const isAuthRequest = [
      "/api/auth/login",
      "/api/auth/google-login",
      "/api/auth/register",
      "/api/auth/email-verify",
      "/api/auth/refresh-token",
      "/api/auth/logout",
    ].some((path) => request.includes(path));

    if (err.response?.status !== 401 || isAuthRequest) {
      throw error;
    }

    try {
      await refreshAccessToken();
      return await rawApiClient<T>(request, options);
    } catch {
      throw error;
    }
  }
};

export default apiClient;