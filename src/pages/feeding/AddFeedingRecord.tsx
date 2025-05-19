import React, { useState, useEffect } from 'react';
import { feedingService } from '../../services/feedingService';
import toast from 'react-hot-toast';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const AddFeedingRecord: React.FC = () => {
  const [formData, setFormData] = useState({
    menuDay: daysOfWeek[0],
    morningValue: '',
    eveningValue: '',
    date: new Date().toISOString().slice(0, 16),
    byWhom: '',
    givenFood: '',
    remark: '',
  });
  const [menu, setMenu] = useState<{ [day: string]: { morning: string; evening: string } }>(() => {
    const stored = localStorage.getItem('feedingMenu');
    if (stored) return JSON.parse(stored);
    const obj: any = {};
    daysOfWeek.forEach(day => {
      obj[day] = { morning: '', evening: '' };
    });
    return obj;
  });
  const [accordingToMenu, setAccordingToMenu] = useState({ morning: null as null | boolean, evening: null as null | boolean });

  const handleFeedingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feedingService.createFeedingRecord({
        casePaperId: 1, // TODO: Replace with actual casePaperId selection if needed
        morningValue: formData.morningValue ? parseFloat(formData.morningValue) : undefined,
        eveningValue: formData.eveningValue ? parseFloat(formData.eveningValue) : undefined,
        date: formData.date.split('T')[0],
        time: formData.date.split('T')[1] ? formData.date.split('T')[1].slice(0,5) : '',
        byWhom: formData.byWhom,
      });
      toast.success('Feeding record created successfully');
      setFormData({
        menuDay: daysOfWeek[0],
        morningValue: '',
        eveningValue: '',
        date: new Date().toISOString().slice(0, 16),
        byWhom: '',
        givenFood: '',
        remark: '',
      });
    } catch (error) {
      toast.error('Failed to create feeding record');
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('feedingMenu');
    if (stored) setMenu(JSON.parse(stored));
    // Sync menu if changed in another tab
    const syncMenu = () => {
      const stored = localStorage.getItem('feedingMenu');
      if (stored) setMenu(JSON.parse(stored));
    };
    window.addEventListener('storage', syncMenu);
    return () => window.removeEventListener('storage', syncMenu);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Feeding Details</h2>
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
                className="border border-gray-300 rounded-md h-12 text-base px-4 bg-gray-100 w-full"
                value={menu[formData.menuDay].morning}
                disabled
                placeholder="Morning Menu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Evening Menu:</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md h-12 text-base px-4 bg-gray-100 w-full"
                value={menu[formData.menuDay].evening}
                disabled
                placeholder="Evening Menu"
              />
            </div>
          </div>
          {/* According to Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">According to Menu:</label>
              <div className="flex items-center space-x-8 mt-2">
                <span className="mr-2">Morning:</span>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="accordingToMenuMorning"
                    checked={accordingToMenu.morning === true}
                    onChange={() => setAccordingToMenu(a => ({ ...a, morning: true }))}
                    className="ml-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="accordingToMenuMorning"
                    checked={accordingToMenu.morning === false}
                    onChange={() => setAccordingToMenu(a => ({ ...a, morning: false }))}
                    className="ml-2"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-8 mt-8">
                <span className="mr-2">Evening:</span>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="accordingToMenuEvening"
                    checked={accordingToMenu.evening === true}
                    onChange={() => setAccordingToMenu(a => ({ ...a, evening: true }))}
                    className="ml-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="accordingToMenuEvening"
                    checked={accordingToMenu.evening === false}
                    onChange={() => setAccordingToMenu(a => ({ ...a, evening: false }))}
                    className="ml-2"
                  />
                  <span>No</span>
                </label>
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
    </div>
  );
};

export default AddFeedingRecord; 