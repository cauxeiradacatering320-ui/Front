export function setAuthCookies(user: { role: string }) {
  const maxAge = 30 * 24 * 60 * 60;
  const isSecure = window.location.protocol === 'https:';
  const base = `path=/; max-age=${maxAge}; samesite=lax`;
  const secure = isSecure ? '; secure' : '';
  document.cookie = `user_role=${user.role}; ${base}${secure}`;
  document.cookie = `__session=1; ${base}${secure}`;
}

export function clearAuthCookies() {
  const base = 'path=/; max-age=0; samesite=lax';
  document.cookie = `user_role=; ${base}`;
  document.cookie = `__session=; ${base}`;
}
