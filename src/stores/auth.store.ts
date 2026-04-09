import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { authService, type AuthSessionPayload } from '@/services/auth.service';
import { storage } from '@/shared/utils/storage';
import type { Role, User } from '@/shared/types/domain';
import { envConfig } from '@/config/env';
import { normalizeToken } from '@/utils/token';

const deriveRole = (source: User | null): Role | undefined => {
  const directRole = source?.role;
  if (directRole) return directRole;

  const rawRoles = (source as (User & { roles?: string[] }) | null)?.roles;
  if (!Array.isArray(rawRoles) || rawRoles.length === 0) return undefined;

  const firstRole = rawRoles[0];
  if (firstRole === 'admin' || firstRole === 'doctor' || firstRole === 'receptionist') {
    return firstRole;
  }

  return undefined;
};

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(storage.getToken());
  const tokenType = ref<string | null>(storage.getTokenType());
  const expiresIn = ref<number | null>(storage.getExpiresIn());
  const refreshToken = ref<string | null>(storage.getRefreshToken());
  const user = ref<User | null>(null);
  const sessionRestored = ref(false);

  const userRaw = storage.getUser();
  if (userRaw) {
    try {
      user.value = JSON.parse(userRaw) as User;
    } catch {
      storage.clearUser();
    }
  }

  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const userRole = computed<Role | undefined>(() => deriveRole(user.value));

  const persistUser = (nextUser: User | null) => {
    user.value = nextUser;
    if (nextUser) {
      storage.setUser(JSON.stringify(nextUser));
      return;
    }
    storage.clearUser();
  };

  const setSession = (payload: AuthSessionPayload): void => {
    const cleanedToken = normalizeToken(payload.access_token);
    if (!cleanedToken) {
      throw new Error('No se recibió un token de acceso válido.');
    }

    token.value = cleanedToken;
    tokenType.value = payload.token_type;
    expiresIn.value = payload.expires_in ?? null;
    refreshToken.value = payload.refresh_token ?? null;

    storage.setToken(cleanedToken);
    storage.setTokenType(payload.token_type);
    storage.setExpiresIn(payload.expires_in ?? null);

    if (payload.refresh_token) {
      storage.setRefreshToken(payload.refresh_token);
    } else {
      storage.clearRefreshToken();
    }

    persistUser(payload.user);
  };

  const clearSession = () => {
    token.value = null;
    tokenType.value = null;
    expiresIn.value = null;
    refreshToken.value = null;
    persistUser(null);
    storage.clearAuth();
  };

  const tryRefresh = async (): Promise<boolean> => {
    if (!envConfig.enableRefreshToken || !refreshToken.value) return false;
    try {
      const refreshed = await authService.refreshToken(refreshToken.value);
      setSession(refreshed);
      return true;
    } catch {
      return false;
    }
  };

  const restoreSession = async () => {
    if (sessionRestored.value) return;
    sessionRestored.value = true;

    const cleanedToken = normalizeToken(token.value);
    if (!cleanedToken) {
      clearSession();
      return;
    }

    token.value = cleanedToken;
    storage.setToken(cleanedToken);

    try {
      const me = await authService.fetchMe();
      persistUser(me);
    } catch {
      const refreshed = await tryRefresh();
      if (!refreshed) {
        clearSession();
        return;
      }
      const me = await authService.fetchMe();
      persistUser(me);
    }
  };

  const login = async (email: string, password: string) => {
    const session = await authService.login(email, password);
    setSession(session);
    sessionRestored.value = true;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Logout endpoint failures should not block local session cleanup.
    }
    clearSession();
  };

  return {
    token,
    tokenType,
    expiresIn,
    user,
    sessionRestored,
    isAuthenticated,
    userRole,
    setSession,
    restoreSession,
    login,
    logout,
    clearSession,
  };
});
