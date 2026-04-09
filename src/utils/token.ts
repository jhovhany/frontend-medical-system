export const normalizeToken = (rawToken: string | null | undefined): string | null => {
  if (!rawToken) return null;

  let token = rawToken.trim();
  if (!token || token === 'undefined' || token === 'null') return null;

  while (/^bearer\s+/i.test(token)) {
    token = token.replace(/^bearer\s+/i, '').trim();
  }

  if (!token) return null;

  const segments = token.split('.');
  if (segments.length !== 3 || segments.some((segment) => segment.trim().length === 0)) {
    return null;
  }

  return token;
};

export const maskTokenForLog = (token: string): string => {
  if (token.length <= 10) return `${token}...`;
  return `${token.slice(0, 10)}...`;
};
