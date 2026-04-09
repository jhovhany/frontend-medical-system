import { z } from 'zod';
import { AxiosError } from 'axios';
import { http } from '@/services/http';
import { envConfig } from '@/config/env';
import type { User } from '@/shared/types/domain';
import { normalizeToken } from '@/utils/token';

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginResponseData {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  user?: User;
  refresh_token?: string;
}

export interface AuthSessionPayload {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user: User;
  refresh_token?: string;
}

const shouldTryFallback = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.response?.status === 404;
};

const withOptionalFallback = async <T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> => {
  try {
    return await primary();
  } catch (error) {
    if (!shouldTryFallback(error)) {
      throw error;
    }
  }

  return fallback();
};

const parseLoginPayload = (payload: LoginResponseData): AuthSessionPayload => {
  const cleanedToken = normalizeToken(payload.access_token);
  if (!cleanedToken) {
    throw new Error('Authentication token is invalid.');
  }

  if (!payload.user) {
    throw new Error('Authenticated user payload is missing.');
  }

  return {
    access_token: cleanedToken,
    token_type: payload.token_type ?? 'Bearer',
    expires_in: payload.expires_in,
    refresh_token: payload.refresh_token,
    user: payload.user,
  };
};

export const authService = {
  validateLogin(payload: LoginInput): LoginInput {
    return loginSchema.parse(payload);
  },
  async login(email: string, password: string): Promise<AuthSessionPayload> {
    const credentials = this.validateLogin({ email, password });

    const response = await withOptionalFallback(
      () => http.post<ApiEnvelope<LoginResponseData>>(envConfig.authLoginPath, credentials),
      () => http.post<ApiEnvelope<LoginResponseData>>('/api/v1/auth/login', credentials),
    );

    return parseLoginPayload(response.data.data);
  },
  async fetchMe(): Promise<User> {
    const response = await withOptionalFallback(
      () => http.get<ApiEnvelope<User>>(envConfig.authMePath),
      () => http.get<ApiEnvelope<User>>('/api/v1/auth/me'),
    );
    return response.data.data;
  },
  async refreshToken(refreshToken: string): Promise<AuthSessionPayload> {
    const response = await withOptionalFallback(
      () =>
        http.post<ApiEnvelope<LoginResponseData>>(envConfig.authRefreshPath, {
          refresh_token: refreshToken,
        }),
      () =>
        http.post<ApiEnvelope<LoginResponseData>>('/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        }),
    );

    return parseLoginPayload(response.data.data);
  },
  async logout(): Promise<void> {
    await withOptionalFallback(
      () => http.post(envConfig.authLogoutPath),
      () => http.post('/api/v1/auth/logout'),
    );
  },
};
