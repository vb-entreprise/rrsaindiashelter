import { Activity } from '../types/activity';
import { apiClient } from './apiClient';
import { FileText, Utensils, Trash2, Package, Users, Shield } from 'lucide-react';
import React, { ReactElement } from 'react';

/**
 * Service for activity log operations
 * @author VB Entreprise
 */
export const activityService = {
  /**
   * Get recent activities
   * @returns Promise<Activity[]> Array of recent activities
   */
  async getRecentActivities(): Promise<Activity[]> {
    try {
      // In a real app, this would be an API call
      // return await apiClient.get('/activities/recent');
      
      // Mock implementation for demo
      return mockGetRecentActivities();
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },
};

/**
 * Mock function to generate sample activity data
 * @returns Activity[] Array of mock activities
 */
const mockGetRecentActivities = (): Activity[] => {
  return [
    {
      id: 1,
      user: 'Dr. Sarah Johnson',
      type: 'case_created',
      description: 'Created a new case for an injured dog',
      subject_id: 42,
      subject_type: 'case_paper',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      icon: React.createElement(FileText, { size: 16 }),
      linkTo: '/case-papers/42',
    },
    {
      id: 2,
      user: 'Admin User',
      type: 'feeding_recorded',
      description: 'Recorded evening feeding for all animals',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      icon: React.createElement(Utensils, { size: 16 }),
      linkTo: '/feeding',
    },
    {
      id: 3,
      user: 'John Smith',
      type: 'cleaning_recorded',
      description: 'Completed morning cleaning of kennels',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      icon: React.createElement(Trash2, { size: 16 }),
      linkTo: '/cleaning',
    },
    {
      id: 4,
      user: 'Admin User',
      type: 'inventory_added',
      description: 'Added 10 bags of dog food to inventory',
      subject_id: 15,
      subject_type: 'inventory',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      icon: React.createElement(Package, { size: 16 }),
      linkTo: '/inventory',
    },
    {
      id: 5,
      user: 'Dr. Sarah Johnson',
      type: 'case_updated',
      description: 'Updated treatment for cat with respiratory infection',
      subject_id: 38,
      subject_type: 'case_paper',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      icon: React.createElement(FileText, { size: 16 }),
      linkTo: '/case-papers/38',
    },
    {
      id: 6,
      user: 'Admin User',
      type: 'user_created',
      description: 'Added new volunteer: Maria Garcia',
      subject_id: 8,
      subject_type: 'user',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      icon: React.createElement(Users, { size: 16 }),
      linkTo: '/users',
    },
  ];
};