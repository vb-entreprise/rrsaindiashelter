/**
 * CasePaperDetails Component
 * 
 * @author VB Entreprise
 * @description Displays detailed information about a specific case paper record.
 * This component fetches and shows comprehensive information about an animal's case,
 * including medical history, treatment plans, and related documentation.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { casePaperService } from '../../services/casePaperService';
import { CasePaper } from '../../types/casePaper';
import toast from 'react-hot-toast';

const CasePaperDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [casePaper, setCasePaper] = useState<CasePaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCasePaper = async () => {
      try {
        if (!id) throw new Error('Case paper ID is required');
        const data = await casePaperService.getCasePaper(parseInt(id));
        setCasePaper(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch case paper details');
        toast.error('Failed to fetch case paper details');
      } finally {
        setLoading(false);
      }
    };

    fetchCasePaper();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this case paper?')) {
      try {
        await casePaperService.deleteCasePaper(parseInt(id));
        toast.success('Case paper deleted successfully');
        navigate('/case-papers');
      } catch (error) {
        toast.error('Failed to delete case paper');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!casePaper) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600">No case paper found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/case-papers')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Case Papers
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/case-papers/${id}/edit`)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Case Paper Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Case Paper #{casePaper.id}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Animal Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Type:</span> {casePaper.animal_type}</p>
              <p><span className="font-medium">Name:</span> {casePaper.animal_name || 'N/A'}</p>
              <p><span className="font-medium">Gender:</span> {casePaper.gender}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Informer Name:</span> {casePaper.informer_name}</p>
              <p><span className="font-medium">Phone:</span> {casePaper.phone}</p>
              <p><span className="font-medium">Alt Phone:</span> {casePaper.alt_phone || 'N/A'}</p>
              <p><span className="font-medium">Aadhar:</span> {casePaper.aadhar || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Treatment Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Treatment:</span> {casePaper.treatment}</p>
            <p><span className="font-medium">Treated By:</span> {casePaper.by_whom}</p>
            <p><span className="font-medium">Status:</span> {casePaper.status}</p>
            <p><span className="font-medium">Date:</span> {new Date(casePaper.date).toLocaleDateString()}</p>
            {casePaper.admission_date && (
              <p><span className="font-medium">Admission Date:</span> {new Date(casePaper.admission_date).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Additional Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Created: {new Date(casePaper.created_at).toLocaleString()}</p>
            <p>Last updated: {new Date(casePaper.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasePaperDetails;