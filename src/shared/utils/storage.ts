const TOKEN_KEY = 'medical_access_token';
const REFRESH_TOKEN_KEY = 'medical_refresh_token';
const USER_KEY = 'medical_current_user';
const TOKEN_TYPE_KEY = 'medical_token_type';
const EXPIRES_IN_KEY = 'medical_expires_in';

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  getTokenType(): string | null {
    return localStorage.getItem(TOKEN_TYPE_KEY);
  },
  setTokenType(tokenType: string): void {
    localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
  },
  clearTokenType(): void {
    localStorage.removeItem(TOKEN_TYPE_KEY);
  },
  getExpiresIn(): number | null {
    const raw = localStorage.getItem(EXPIRES_IN_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  },
  setExpiresIn(expiresIn: number | null): void {
    if (expiresIn === null || Number.isNaN(expiresIn)) {
      localStorage.removeItem(EXPIRES_IN_KEY);
      return;
    }
    localStorage.setItem(EXPIRES_IN_KEY, String(expiresIn));
  },
  clearExpiresIn(): void {
    localStorage.removeItem(EXPIRES_IN_KEY);
  },
  getUser(): string | null {
    return localStorage.getItem(USER_KEY);
  },
  setUser(user: string): void {
    localStorage.setItem(USER_KEY, user);
  },
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },
  clearAuth(): void {
    this.clearToken();
    this.clearRefreshToken();
    this.clearTokenType();
    this.clearExpiresIn();
    this.clearUser();
  },
};
