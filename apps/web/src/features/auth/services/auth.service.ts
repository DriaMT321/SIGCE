import { apiClient } from '../../../lib/api-client';
import { LoginFormData, authResponseSchema, AuthResponse } from '../schemas/auth.schema';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse['data']> {
    const response = await apiClient.post('/auth/login', data);
    const parsed = authResponseSchema.parse(response.data);
    
    // Guardar token y datos del usuario en localStorage
    localStorage.setItem('access_token', parsed.data.accessToken);
    localStorage.setItem('refresh_token', parsed.data.refreshToken);
    localStorage.setItem('auth_user', JSON.stringify(parsed.data.user));

    return parsed.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
