/**
 * Service for handling inventory operations
 * @author VB Entreprise
 */

import { apiClient } from './apiClient';

export interface InventoryItem {
  id: number;
  name: string;
  category: 'food' | 'medicine' | 'equipment' | 'supplies';
  currentStock: number;
  minimumLevel: number;
  unit: string;
  lastRestocked: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItem {
  name: string;
  category: 'food' | 'medicine' | 'equipment' | 'supplies';
  currentStock: number;
  minimumLevel: number;
  unit: string;
}

export const inventoryService = {
  /**
   * Get all inventory items
   */
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      // Mock implementation for demo
      return [
        {
          id: 1,
          name: "Dog Food",
          category: "food",
          currentStock: 50,
          minimumLevel: 20,
          unit: "kg",
          lastRestocked: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  /**
   * Create a new inventory item
   */
  async createInventoryItem(data: CreateInventoryItem): Promise<InventoryItem> {
    try {
      // Mock implementation for demo
      return {
        id: Math.floor(Math.random() * 1000),
        ...data,
        lastRestocked: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }
};