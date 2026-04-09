import axios, { AxiosError, type AxiosResponse } from 'axios';
import { envConfig } from '@/config/env';
import { storage } from '@/shared/utils/storage';
import { useUiStore } from '@/stores/ui.store';
import { maskTokenForLog, normalizeToken } from '@/utils/token';

interface ErrorPayload {
  message?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

let loggedBaseUrl = false;

const getErrorMessage = (error: AxiosError): string => {
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión o el estado del backend.';
  }

  const data = error.response?.data as ErrorPayload | undefined;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;
  if (error.response?.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.';
  if (error.response?.status === 403) return 'No tienes permisos para esta acción.';
  if (error.response?.status === 422) return 'Datos inválidos. Revisa el formulario.';
  if ((error.response?.status ?? 0) >= 500) return 'Error interno del servidor.';
  return 'Ocurrió un error inesperado.';
};

export const http = axios.create({
  baseURL: envConfig.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const uiStore = useUiStore();
  uiStore.clearValidationErrors();

  const normalizedToken = normalizeToken(storage.getToken());

  if (normalizedToken) {
    config.headers.Authorization = `Bearer ${normalizedToken}`;
  } else if (config.headers && 'Authorization' in config.headers) {
    delete config.headers.Authorization;
  }

  if (envConfig.isDev) {
    if (!loggedBaseUrl) {
      console.info('[http] baseURL:', envConfig.apiBaseUrl);
      loggedBaseUrl = true;
    }

    if (normalizedToken) {
      console.info('[http] Authorization sent:', `${maskTokenForLog(normalizedToken)}`);
    } else {
      console.info('[http] Authorization skipped (no valid token).');
    }
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const uiStore = useUiStore();
    const message = getErrorMessage(error);

    if (error.response?.status === 422) {
      const payload = error.response.data as ErrorPayload | undefined;
      const errors = payload?.errors ?? {};
      const normalizedErrors = Object.entries(errors).reduce<Record<string, string[]>>(
        (acc, [field, value]) => {
          acc[field] = Array.isArray(value) ? value : [value];
          return acc;
        },
        {},
      );
      uiStore.setValidationErrors(normalizedErrors);
    }

    uiStore.setError(message, error.response?.status);

    if (error.response?.status === 401) {
      storage.clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
