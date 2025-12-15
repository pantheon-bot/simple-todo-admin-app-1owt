import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'admin-auth';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export function isAdmin() {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === '1';
}

export function assertAdmin() {
  if (!isAdmin()) {
    throw new Error('Unauthorized');
  }
}

export function startAdminSession() {
  cookies().set({
    name: ADMIN_COOKIE_NAME,
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE_NAME);
}
