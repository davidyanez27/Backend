import { envs } from './envs';

export class CookieConfig {
  static readonly TOKEN_COOKIE_NAME = 'auth_token';
  static readonly REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

  private static get isProduction() {
    return envs.NODE_ENV === 'production';
  }

  static getTokenCookieOptions() {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' as const : 'lax' as const,
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
  }

  static getRefreshTokenCookieOptions() {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' as const : 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
  }

  static getClearCookieOptions() {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' as const : 'lax' as const,
      path: '/',
    };
  }
}