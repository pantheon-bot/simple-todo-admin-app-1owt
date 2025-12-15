import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'admin-auth';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === '1';
}

export async function assertAdmin() {
  if (!(await isAdmin())) {
    throw new Error('Unauthorized');
  }
}

export async function startAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
