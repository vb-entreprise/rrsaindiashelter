/**
 * User type definition
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
}

/**
 * Role type definition
 */
export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

/**
 * Permission type definition
 */
export interface Permission {
  id: number;
  name: string;
}

/**
 * AuthResponse type for login/register responses
 */
export interface AuthResponse {
  user: User;
  token: string;
}