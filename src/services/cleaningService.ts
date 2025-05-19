/**
 * Service for handling cleaning operations
 * @author VB Entreprise
 */

import { apiClient } from './apiClient';

export interface CleaningRecord {
  id: number;
  area: string;
  date: string;
  time: string;
  byWhom: string;
  notes?: string;
  status: 'pending' | 'completed' | 'verified';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCleaningRecord {
  area: string;
  date: string;
  time: string;
  byWhom: string;
  notes?: string;
}

export const cleaningService = {
  /**
   * Get all cleaning records
   */
  async getCleaningRecords(): Promise<CleaningRecord[]> {
    try {
      // Mock implementation for demo
      return [
        {
          id: 1,
          area: "Dog Kennel A",
          date: "2025-05-06",
          time: "09:00",
          byWhom: "Jane Doe",
          status: "completed",
          notes: "Deep cleaned and sanitized",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching cleaning records:', error);
      throw error;
    }
  },

  /**
   * Create a new cleaning record
   */
  async createCleaningRecord(data: CreateCleaningRecord): Promise<CleaningRecord> {
    try {
      // Mock implementation for demo
      return {
        id: Math.floor(Math.random() * 1000),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating cleaning record:', error);
      throw error;
    }
  }
};