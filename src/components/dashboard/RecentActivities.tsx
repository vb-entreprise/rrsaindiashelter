import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../../services/activityService';
import { Activity } from '../../types/activity';
import { formatDistanceToNow } from '../../utils/dateUtils';

/**
 * Recent activities component for the dashboard
 * Shows the latest actions performed in the system
 */
const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getRecentActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent activities found.
      </div>
    );
  }

  // Helper function to get activity icon color based on activity type
  const getActivityColor = (type: string): string => {
    const colors: Record<string, string> = {
      'case_created': 'bg-blue-100 text-blue-600',
      'case_updated': 'bg-green-100 text-green-600',
      'feeding_recorded': 'bg-orange-100 text-orange-600',
      'cleaning_recorded': 'bg-purple-100 text-purple-600',
      'inventory_added': 'bg-teal-100 text-teal-600',
      'inventory_used': 'bg-red-100 text-red-600',
      'user_created': 'bg-indigo-100 text-indigo-600',
    };
    
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
            {activity.icon}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <div className="mt-1 flex items-center">
                  <span className="text-xs text-gray-500">
                    by {activity.user}
                  </span>
                  <span className="mx-1 text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at))}
                  </span>
                </div>
              </div>
              {activity.linkTo && (
                <Link 
                  to={activity.linkTo}
                  className="ml-2 text-xs text-green-600 hover:text-green-800 hover:underline"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;