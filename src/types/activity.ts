import { ReactNode } from 'react';

/**
 * Activity type definition
 */
export interface Activity {
  id: number;
  user: string;
  type: string;
  description: string;
  subject_id?: number;
  subject_type?: string;
  created_at: string;
  updated_at: string;
  icon: ReactNode;
  linkTo?: string;
}