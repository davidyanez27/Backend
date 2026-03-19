import { envs } from './envs';

export class CookieConfig {
  static readonly TOKEN_COOKIE_NAME = 'auth_token';
  static readonly REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

  static getTokenCookieOptions() {
    return {
      httpOnly: true,           // Prevents XSS attacks
      secure: envs.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax' as const, // CSRF protection
      maxAge: 15 * 60 * 1000,   // 15 minutes
      path: '/',
    };
  }

  static getRefreshTokenCookieOptions() {
    return {
      httpOnly: true,           // Prevents XSS attacks
      secure: envs.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax' as const, // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    };
  }

  static getClearCookieOptions() {
    return {
      httpOnly: true,
      secure: envs.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
  }
}