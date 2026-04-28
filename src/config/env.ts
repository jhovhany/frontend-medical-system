const getEnv = (key: string, fallback: string): string => {
  const value = import.meta.env[key];
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const envConfig = {
  appTitle: getEnv('VITE_APP_TITLE', 'Sistema Medico Frontend'),
  apiBaseUrl: getEnv('VITE_API_URL', '/api'),
  authLoginPath: getEnv('VITE_AUTH_LOGIN_PATH', '/api/auth/login'),
  authMePath: getEnv('VITE_AUTH_ME_PATH', '/api/auth/me'),
  authRefreshPath: getEnv('VITE_AUTH_REFRESH_PATH', '/api/auth/refresh'),
  authLogoutPath: getEnv('VITE_AUTH_LOGOUT_PATH', '/api/auth/logout'),
  enableRefreshToken: getEnv('VITE_ENABLE_REFRESH', 'true') === 'true',
  isDev: import.meta.env.DEV,
};
