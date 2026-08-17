import { apiClient } from '../../../lib/api-client';
import { authResponseSchema, type AuthResponse, type LoginFormData } from '../schemas/auth.schema';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse['data']> {
    const payload: Partial<LoginFormData> = {
      role: data.role,
      identifier: data.identifier.trim(),
    };
    if (data.secret && data.secret.trim() !== '') {
      payload.secret = data.secret;
    }
    if (data.secondaryIdentifier && data.secondaryIdentifier.trim() !== '') {
      payload.secondaryIdentifier = data.secondaryIdentifier.trim();
    }

    const response = await apiClient.post('/auth/role-login', payload);
    const parsed = authResponseSchema.parse(response.data);
    localStorage.setItem('access_token', parsed.data.accessToken);
    localStorage.setItem('refresh_token', parsed.data.refreshToken);
    localStorage.setItem('auth_user', JSON.stringify(parsed.data.user));
    return parsed.data;
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem('access_token'));
  },

  getCurrentUser(): AuthResponse['data']['user'] | null {
    const storedUser = localStorage.getItem('auth_user');
    if (!storedUser) return null;

    try {
      const parsedUser: unknown = JSON.parse(storedUser);
      const result = authResponseSchema.shape.data.shape.user.safeParse(parsedUser);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  },
};
