/**
 * Service for handling feeding operations
 * @author VB Entreprise
 */

import { apiClient } from './apiClient';

export interface FeedingRecord {
  id: number;
  casePaperId: number;
  animalName: string;
  morningValue: number;
  eveningValue: number;
  date: string;
  time: string;
  byWhom: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedingRecord {
  casePaperId: number;
  morningValue?: number;
  eveningValue?: number;
  date: string;
  time: string;
  byWhom: string;
  notes?: string;
}

export const feedingService = {
  /**
   * Get all feeding records
   */
  async getFeedingRecords(): Promise<FeedingRecord[]> {
    try {
      // Mock implementation for demo
      return [
        {
          id: 1,
          casePaperId: 1,
          animalName: "Max",
          morningValue: 200,
          eveningValue: 200,
          date: "2025-05-06",
          time: "08:00",
          byWhom: "John Smith",
          notes: "Ate well",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching feeding records:', error);
      throw error;
    }
  },

  /**
   * Create a new feeding record
   */
  async createFeedingRecord(data: CreateFeedingRecord): Promise<FeedingRecord> {
    try {
      // Mock implementation for demo
      return {
        id: Math.floor(Math.random() * 1000),
        animalName: "Test Animal",
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating feeding record:', error);
      throw error;
    }
  }
};