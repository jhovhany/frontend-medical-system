const getEnv = (name: string, fallback = ''): string => {
  const value = import.meta.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

export const appConfig = {
  appTitle: getEnv('VITE_APP_TITLE', 'Sistema Medico Frontend'),
  apiBaseUrl: getEnv('VITE_API_URL', '/api'),
  authLoginPath: getEnv('VITE_AUTH_LOGIN_PATH', 'auth/login'),
  authMePath: getEnv('VITE_AUTH_ME_PATH', 'auth/me'),
  authRefreshPath: getEnv('VITE_AUTH_REFRESH_PATH', 'auth/refresh'),
  enableRefreshToken: getEnv('VITE_ENABLE_REFRESH', 'true') === 'true',
};

export const resolveApiUrl = (path: string): string => {
  const base = appConfig.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
