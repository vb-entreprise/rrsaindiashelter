export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  phone?: string;
  created_at: string;
  updated_at: string;
} 