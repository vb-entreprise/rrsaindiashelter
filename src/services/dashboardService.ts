import { apiClient } from './apiClient';

interface DashboardStats {
  totalCases: number;
  activeCases: number;
  pendingFeedings: number;
  pendingCleanings: number;
  lowInventoryItems: number;
}

/**
 * Service for dashboard operations
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // In a real app, this would be an API call
      // return await apiClient.get('/dashboard/stats');
      
      // Mock implementation for demo
      return mockGetDashboardStats();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

// Mock data for demo purposes
const mockGetDashboardStats = (): DashboardStats => {
  return {
    totalCases: 152,
    activeCases: 87,
    pendingFeedings: 12,
    pendingCleanings: 8,
    lowInventoryItems: 5,
  };
};