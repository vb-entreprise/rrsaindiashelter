/**
 * Feeding management page component
 * @author VB Entreprise
 */

import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { feedingService, FeedingRecord } from '../../services/feedingService';
import toast from 'react-hot-toast';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

interface FeedingProps {
  menuOnly?: boolean;
}

const Feeding: React.FC<FeedingProps> = ({ menuOnly }) => {
  const [activeTab, setActiveTab] = useState<'feeding' | 'menu'>(menuOnly ? 'menu' : 'feeding');
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [menu, setMenu] = useState<{ [day: string]: { morning: string; evening: string } }>(() => {
    const stored = localStorage.getItem('feedingMenu');
    if (stored) return JSON.parse(stored);
    const obj: any = {};
    daysOfWeek.forEach(day => {
      obj[day] = { morning: '', evening: '' };
    });
    return obj;
  });
  const [formData, setFormData] = useState({
    casePaperId: '',
    morningValue: '',
    eveningValue: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    byWhom: '',
    notes: '',
    givenFood: '',
    remark: '',
    menuDay: daysOfWeek[0],
    menuMorning: '',
    menuEvening: ''
  });

  useEffect(() => {
    fetchRecords();
    // Sync menu from localStorage if changed elsewhere
    const syncMenu = () => {
      const stored = localStorage.getItem('feedingMenu');
      if (stored) setMenu(JSON.parse(stored));
    };
    window.addEventListener('storage', syncMenu);
    return () => window.removeEventListener('storage', syncMenu);
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await feedingService.getFeedingRecords();
      setRecords(data);
    } catch (error) {
      toast.error('Failed to fetch feeding records');
    } finally {
      setLoading(false);
    }
  };

  // Menu tab handlers
  const handleMenuChange = (day: string, field: 'morning' | 'evening', value: string) => {
    setMenu(prev => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day],
          [field]: value
        }
      };
      localStorage.setItem('feedingMenu', JSON.stringify(updated));
      return updated;
    });
  };

  // Feeding form handlers
  const handleFeedingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'menuDay') {
      setSelectedDay(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feedingService.createFeedingRecord({
        casePaperId: parseInt(formData.casePaperId),
        morningValue: formData.morningValue ? parseFloat(formData.morningValue) : undefined,
        eveningValue: formData.eveningValue ? parseFloat(formData.eveningValue) : undefined,
        date: formData.date,
        time: formData.time,
        byWhom: formData.byWhom,
        notes: formData.notes
      });
      toast.success('Feeding record created successfully');
      setShowForm(false);
      fetchRecords();
    } catch (error) {
      toast.error('Failed to create feeding record');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex">
        {/* Vertical Tabs */}
        {!menuOnly && (
          <div className="flex flex-col w-48 mr-8">
            <button
              className={`py-3 px-4 text-left font-semibold border-l-4 ${activeTab === 'feeding' ? 'bg-white border-green-600 text-green-700' : 'bg-gray-100 border-transparent text-gray-700'} rounded-r-md mb-2`}
              onClick={() => setActiveTab('feeding')}
            >
              Feeding
            </button>
            <button
              className={`py-3 px-4 text-left font-semibold border-l-4 ${activeTab === 'menu' ? 'bg-white border-green-600 text-green-700' : 'bg-gray-100 border-transparent text-gray-700'} rounded-r-md`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
          </div>
        )}
        {/* Tab Content */}
        <div className="flex-1">
          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Weekly Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {daysOfWeek.map(day => (
                  <div key={day} className="mb-4">
                    <div className="font-semibold mb-2">{day}</div>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md h-12 text-base px-4"
                        placeholder="Morning Menu"
                        value={menu[day].morning}
                        onChange={e => handleMenuChange(day, 'morning', e.target.value)}
                      />
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md h-12 text-base px-4"
                        placeholder="Evening Menu"
                        value={menu[day].evening}
                        onChange={e => handleMenuChange(day, 'evening', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Feeding Tab */}
          {!menuOnly && activeTab === 'feeding' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Feeding Records</h1>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Record
                </button>
              </div>
              {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">New Feeding Record</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Select Day</label>
                        <select
                          name="menuDay"
                          value={formData.menuDay}
                          onChange={handleFeedingFormChange}
                          className="border border-gray-300 rounded-md h-12 text-base px-4 w-full"
                        >
                          {daysOfWeek.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Menu display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Morning Menu:</label>
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md h-12 text-base px-4 bg-gray-100"
                          value={menu[formData.menuDay].morning}
                          disabled
                          placeholder="Morning Menu"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Evening Menu:</label>
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md h-12 text-base px-4 bg-gray-100"
                          value={menu[formData.menuDay].evening}
                          disabled
                          placeholder="Evening Menu"
                        />
                      </div>
                    </div>
                    {/* According to Menu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">According to Menu:</label>
                        <div className="flex items-center space-x-4 mt-2">
                          <span>Morning:</span>
                          <label className="flex items-center"><input type="checkbox" className="ml-2" /> Yes</label>
                          <label className="flex items-center"><input type="checkbox" className="ml-2" /> No</label>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-4 mt-8">
                          <span>Evening:</span>
                          <label className="flex items-center"><input type="checkbox" className="ml-2" /> Yes</label>
                          <label className="flex items-center"><input type="checkbox" className="ml-2" /> No</label>
                        </div>
                      </div>
                    </div>
                    {/* Date, By Whom, Given Food, Remark */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date and Time:</label>
                        <input
                          type="datetime-local"
                          name="date"
                          value={formData.date}
                          onChange={handleFeedingFormChange}
                          className="border border-gray-300 rounded-md h-12 text-base px-4 w-full"
                          placeholder="Date and Time"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Given Food (Optional):</label>
                        <input
                          type="text"
                          name="givenFood"
                          value={formData.givenFood}
                          onChange={handleFeedingFormChange}
                          className="border border-gray-300 rounded-md h-12 text-base px-4 w-full"
                          placeholder="Given Food"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">By Whom:</label>
                        <input
                          type="text"
                          name="byWhom"
                          value={formData.byWhom}
                          onChange={handleFeedingFormChange}
                          className="border border-gray-300 rounded-md h-12 text-base px-4 w-full"
                          placeholder="By Whom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Remark:</label>
                        <input
                          type="text"
                          name="remark"
                          value={formData.remark}
                          onChange={handleFeedingFormChange}
                          className="border border-gray-300 rounded-md h-12 text-base px-4 w-full"
                          placeholder="Remark"
                        />
                      </div>
                    </div>
                    <div className="flex justify-start mt-4">
                      <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded">Submit</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Morning Feed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evening Feed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        By Whom
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {record.animalName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Case #{record.casePaperId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.date}</div>
                          <div className="text-sm text-gray-500">{record.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {record.morningValue}g
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {record.eveningValue}g
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.byWhom}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feeding;