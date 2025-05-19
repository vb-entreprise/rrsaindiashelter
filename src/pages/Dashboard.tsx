import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Utensils, Trash2, Package, AlertTriangle, Activity } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/dashboard/StatCard';
import RecentActivities from '../components/dashboard/RecentActivities';
import AnimalStatusChart from '../components/dashboard/AnimalStatusChart';
import InventoryLevelChart from '../components/dashboard/InventoryLevelChart';

/**
 * Dashboard page component
 * Shows key metrics, recent activities, and status charts
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    pendingFeedings: 0,
    pendingCleanings: 0,
    lowInventoryItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Total Cases" 
          value={stats.totalCases} 
          icon={<FileText className="h-8 w-8 text-blue-500" />}
          link="/case-papers"
        />
        <StatCard 
          title="Active Cases" 
          value={stats.activeCases} 
          icon={<Activity className="h-8 w-8 text-green-500" />}
          link="/case-papers?status=active"
        />
        <StatCard 
          title="Pending Feedings" 
          value={stats.pendingFeedings} 
          icon={<Utensils className="h-8 w-8 text-orange-500" />}
          link="/feeding"
        />
        <StatCard 
          title="Pending Cleanings" 
          value={stats.pendingCleanings} 
          icon={<Trash2 className="h-8 w-8 text-purple-500" />}
          link="/cleaning"
        />
        <StatCard 
          title="Low Inventory" 
          value={stats.lowInventoryItems} 
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
          link="/inventory?filter=low"
        />
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Animal Status</h2>
          <AnimalStatusChart />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Levels</h2>
          <InventoryLevelChart />
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
          <Link to="/case-papers" className="text-green-600 text-sm hover:underline">
            View All
          </Link>
        </div>
        <RecentActivities />
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link to="/case-papers/create" className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FileText className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium text-gray-800">New Case Paper</span>
          </Link>
          <Link to="/feeding" className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Utensils className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium text-gray-800">Record Feeding</span>
          </Link>
          <Link to="/cleaning" className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Trash2 className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium text-gray-800">Record Cleaning</span>
          </Link>
          <Link to="/inventory" className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <Package className="h-6 w-6 text-orange-600 mr-3" />
            <span className="font-medium text-gray-800">Manage Inventory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;