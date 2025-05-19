import React from 'react';

/**
 * Animal status chart for the dashboard
 * Shows distribution of animals by status and type
 * In a real app, this would use a charting library like Chart.js or Recharts
 */
const AnimalStatusChart: React.FC = () => {
  // Mock data for the chart
  const statuses = [
    { name: 'Active', value: 87, color: 'bg-green-500' },
    { name: 'Discharged', value: 45, color: 'bg-blue-500' },
    { name: 'Deceased', value: 20, color: 'bg-gray-500' },
  ];
  
  const types = [
    { name: 'Dogs', value: 68, color: 'bg-orange-500' },
    { name: 'Cats', value: 42, color: 'bg-purple-500' },
    { name: 'Birds', value: 25, color: 'bg-yellow-500' },
    { name: 'Other', value: 17, color: 'bg-teal-500' },
  ];
  
  const totalCases = statuses.reduce((sum, status) => sum + status.value, 0);

  return (
    <div className="flex flex-col space-y-6">
      {/* Status Distribution */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Status Distribution</h3>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div key={status.name} className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`${status.color} h-4 rounded-full`} 
                  style={{ width: `${(status.value / totalCases) * 100}%` }}
                ></div>
              </div>
              <div className="min-w-[100px] ml-3 flex justify-between">
                <span className="text-xs font-medium text-gray-700">{status.name}</span>
                <span className="text-xs font-medium text-gray-500">{status.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Animal Type Distribution */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Animal Type Distribution</h3>
        <div className="flex items-center space-x-2 mt-2">
          {types.map((type) => (
            <div 
              key={type.name} 
              className="flex-1 flex flex-col items-center"
            >
              <div className="relative pt-1 w-full">
                <div 
                  className={`${type.color} h-24 rounded-t-lg w-full flex items-end justify-center`}
                  style={{ height: `${(type.value / Math.max(...types.map(t => t.value))) * 120}px` }}
                >
                  <span className="text-xs font-bold text-white mb-1">{type.value}</span>
                </div>
                <div className={`${type.color} bg-opacity-20 py-1 rounded-b-lg text-center`}>
                  <span className="text-xs font-medium text-gray-700">{type.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalStatusChart;