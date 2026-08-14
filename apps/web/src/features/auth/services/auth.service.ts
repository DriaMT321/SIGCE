import { apiClient } from '../../../lib/api-client';
import { authResponseSchema, type AuthResponse, type LoginFormData } from '../schemas/auth.schema';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse['data']> {
    const response = await apiClient.post('/auth/role-login', data);
    const parsed = authResponseSchema.parse(response.data);
    localStorage.setItem('access_token', parsed.data.accessToken);
    localStorage.setItem('refresh_token', parsed.data.refreshToken);
    localStorage.setItem('auth_user', JSON.stringify(parsed.data.user));
    return parsed.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  },
};
