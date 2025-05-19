import React from 'react';

/**
 * Inventory levels chart for dashboard
 * Shows current stock levels for essential items
 * In a real app, this would use a charting library like Chart.js or Recharts
 */
const InventoryLevelChart: React.FC = () => {
  // Mock data for the chart
  const inventoryItems = [
    { name: 'Dog Food', current: 85, total: 100, unit: 'kg' },
    { name: 'Cat Food', current: 45, total: 50, unit: 'kg' },
    { name: 'Medicines', current: 30, total: 100, unit: 'units' },
    { name: 'Bandages', current: 15, total: 50, unit: 'boxes' },
    { name: 'Disinfectant', current: 5, total: 20, unit: 'liters' },
    { name: 'Cat Litter', current: 30, total: 60, unit: 'kg' },
  ];

  // Helper function to determine color based on stock level
  const getColorClass = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    if (percentage < 20) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      {inventoryItems.map((item) => {
        const percentage = (item.current / item.total) * 100;
        const colorClass = getColorClass(item.current, item.total);
        
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="text-gray-500">
                {item.current} / {item.total} {item.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`${colorClass} h-2.5 rounded-full`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            {item.current <= item.total * 0.2 && (
              <p className="text-xs text-red-500 font-medium">
                Low stock! Please reorder.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InventoryLevelChart;