import { User } from '../types/user';

/**
 * Service for handling authentication operations
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      // For demo purposes, accept any email/password
      const user: User = {
        id: 1,
        name: 'Demo User',
        email: email,
        role: 'staff',
        phone: '1234567890',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  },

  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string, phone: string): Promise<User> {
    try {
      const user: User = {
        id: 2,
        name,
        email,
        role: 'staff',
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  },

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem('user');
  },

  /**
   * Get the current logged in user
   */
  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) return null;
      
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('user');
      return null;
    }
  },
};