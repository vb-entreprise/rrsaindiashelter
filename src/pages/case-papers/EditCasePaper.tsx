/**
 * EditCasePaper.tsx
 * @description Component for editing existing case papers in the animal shelter management system
 * @author VB Entreprise
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { casePaperService } from '../../services/casePaperService';
import { CasePaper, UpdateCasePaperPayload } from '../../types/casePaper';

const EditCasePaper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateCasePaperPayload>({
    date: '',
    admission_date: '',
    informer_name: '',
    phone: '',
    alt_phone: '',
    aadhar: '',
    animal_type: '',
    animal_name: '',
    gender: '',
    treatment: '',
    by_whom: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchCasePaper = async () => {
      try {
        if (!id) return;
        const data = await casePaperService.getCasePaper(parseInt(id));
        setFormData({
          date: data.date,
          admission_date: data.admission_date || '',
          informer_name: data.informer_name,
          phone: data.phone,
          alt_phone: data.alt_phone || '',
          aadhar: data.aadhar || '',
          animal_type: data.animal_type,
          animal_name: data.animal_name || '',
          gender: data.gender,
          treatment: data.treatment,
          by_whom: data.by_whom,
          status: data.status
        });
      } catch (error) {
        toast.error('Failed to fetch case paper details');
        console.error('Error fetching case paper:', error);
      }
    };

    fetchCasePaper();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await casePaperService.updateCasePaper(parseInt(id), formData);
      toast.success('Case paper updated successfully');
      navigate(`/case-papers/${id}`);
    } catch (error) {
      toast.error('Failed to update case paper');
      console.error('Error updating case paper:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Case Paper</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Date and Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Admission Date</label>
            <input
              type="datetime-local"
              name="admission_date"
              value={formData.admission_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Informer Name</label>
            <input
              type="text"
              name="informer_name"
              value={formData.informer_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Alternative Phone</label>
            <input
              type="tel"
              name="alt_phone"
              value={formData.alt_phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Aadhar Number</label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Animal Type</label>
            <input
              type="text"
              name="animal_type"
              value={formData.animal_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Animal Name</label>
            <input
              type="text"
              name="animal_name"
              value={formData.animal_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Treatment</label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 text-base px-4 py-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Treated By</label>
            <input
              type="text"
              name="by_whom"
              value={formData.by_whom}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 h-12 text-base px-4"
              required
            >
              <option value="active">Active</option>
              <option value="discharged">Discharged</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(`/case-papers/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Case Paper'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCasePaper;