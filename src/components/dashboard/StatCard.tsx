import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  link: string;
}

/**
 * Stat card component for dashboard metrics
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, link }) => {
  return (
    <Link 
      to={link}
      className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="rounded-full p-2 bg-gray-50">{icon}</div>
      </div>
      <div className="mt-4 flex items-center text-sm text-green-600">
        <span>View details</span>
        <ChevronRight className="ml-1 w-4 h-4" />
      </div>
    </Link>
  );
};

export default StatCard;