import React, { useEffect, useState } from 'react';
import { feedingService, FeedingRecord } from '../../services/feedingService';
import { useNavigate } from 'react-router-dom';

const FeedingRecords: React.FC = () => {
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await feedingService.getFeedingRecords();
        setRecords(data);
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Feeding Records Summary</h1>
      <div className="space-y-6">
        {records.map((record) => (
          <div
            key={record.id}
            className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-green-50 cursor-pointer shadow-sm"
            onClick={() => navigate(`/feeding/records/${record.id}`)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Animal</label>
                <div className="text-base text-gray-900">{record.animalName}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date & Time</label>
                <div className="text-base text-gray-900">{record.date} {record.time}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">By Whom</label>
                <div className="text-base text-gray-900">{record.byWhom}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Morning Feed</label>
                <div className="text-base text-gray-900">{record.morningValue}g</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Evening Feed</label>
                <div className="text-base text-gray-900">{record.eveningValue}g</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                <div className="text-base text-gray-900">{record.notes || ''}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedingRecords; 