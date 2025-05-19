/**
 * @file Cleaning.tsx
 * @description Cleaning management page component for the animal shelter management system
 * @author VB Entreprise
 */

import React, { useEffect, useState } from 'react';
import { cleaningService, CleaningRecord } from '../../services/cleaningService';

/**
 * Cleaning component handles the display and management of cleaning schedules and tasks
 * for the animal shelter facilities
 */
const Cleaning: React.FC = () => {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    area: '',
    date: '',
    time: '',
    byWhom: '',
    status: 'pending',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await cleaningService.getCleaningRecords();
        setRecords(data);
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const [date, time] = formData.date.split('T');
      const newRecord = await cleaningService.createCleaningRecord({
        area: formData.area,
        date: date || '',
        time: time || '',
        byWhom: formData.byWhom,
        notes: formData.notes,
      });
      // Add status manually if returned record doesn't include it
      newRecord.status = formData.status as any;
      setRecords(prev => [newRecord, ...prev]);
      setFormData({ area: '', date: '', time: '', byWhom: '', status: 'pending', notes: '' });
    } catch (error) {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Cleaning Management
      </h1>
      {/* Add Cleaning Record Form */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Add Cleaning Record</h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Area</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-md h-10 text-base px-3 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-md h-10 text-base px-3 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">By Whom</label>
            <input
              type="text"
              name="byWhom"
              value={formData.byWhom}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-md h-10 text-base px-3 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-md h-10 text-base px-3 w-full"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-md text-base px-3 w-full min-h-[40px]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Cleaning Records Summary</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Area</label>
                  <div className="text-base text-gray-900">{record.area}</div>
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
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                  <div className="text-base text-gray-900 capitalize">{record.status}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                  <div className="text-base text-gray-900">{record.notes || ''}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cleaning;