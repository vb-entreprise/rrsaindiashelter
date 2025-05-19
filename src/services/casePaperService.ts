import { 
  CasePaper, 
  CreateCasePaperPayload, 
  UpdateCasePaperPayload,
  CasePaperListParams,
  PaginatedResponse
} from '../types/casePaper';
import { apiClient } from './apiClient';

/**
 * Service for handling case paper operations
 */
export const casePaperService = {
  /**
   * Get a paginated list of case papers
   */
  async getCasePapers(params: CasePaperListParams): Promise<PaginatedResponse<CasePaper>> {
    try {
      const response = await apiClient.get('/case-papers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching case papers:', error);
      throw error;
    }
  },

  /**
   * Get a specific case paper by ID
   */
  async getCasePaper(id: number): Promise<CasePaper> {
    try {
      const response = await apiClient.get(`/case-papers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching case paper with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new case paper
   */
  async createCasePaper(data: CreateCasePaperPayload): Promise<CasePaper> {
    try {
      const response = await apiClient.post('/case-papers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating case paper:', error);
      throw error;
    }
  },

  /**
   * Update an existing case paper
   */
  async updateCasePaper(id: number, data: UpdateCasePaperPayload): Promise<CasePaper> {
    try {
      const response = await apiClient.put(`/case-papers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating case paper with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a case paper
   */
  async deleteCasePaper(id: number): Promise<void> {
    try {
      await apiClient.delete(`/case-papers/${id}`);
    } catch (error) {
      console.error(`Error deleting case paper with ID ${id}:`, error);
      throw error;
    }
  },
};

// Mock data and implementations for demo purposes
let mockCasePapers: CasePaper[] = [
  {
    id: 1,
    date: '2023-05-15',
    admission_date: '2023-05-15',
    informer_name: 'John Doe',
    phone: '9876543210',
    animal_type: 'dog',
    gender: 'male',
    treatment: 'Fracture in right hind leg. Applied cast and administered pain medication.',
    by_whom: 'Dr. Smith',
    status: 'active',
    created_at: '2023-05-15T10:30:00Z',
    updated_at: '2023-05-15T10:30:00Z',
  },
  {
    id: 2,
    date: '2023-05-16',
    informer_name: 'Jane Smith',
    phone: '8765432109',
    animal_type: 'cat',
    gender: 'female',
    treatment: 'Dehydration and malnutrition. Administered IV fluids and started on a feeding regimen.',
    by_whom: 'Dr. Johnson',
    status: 'active',
    created_at: '2023-05-16T09:15:00Z',
    updated_at: '2023-05-16T09:15:00Z',
  },
  {
    id: 3,
    date: '2023-05-14',
    admission_date: '2023-05-14',
    informer_name: 'Michael Brown',
    phone: '7654321098',
    animal_type: 'bird',
    gender: 'unknown',
    treatment: 'Broken wing. Splinted and bandaged.',
    by_whom: 'Dr. Garcia',
    status: 'discharged',
    created_at: '2023-05-14T14:45:00Z',
    updated_at: '2023-05-20T11:30:00Z',
  },
  {
    id: 4,
    date: '2023-05-13',
    informer_name: 'Sarah Wilson',
    phone: '6543210987',
    animal_type: 'other',
    animal_name: 'Tortoise',
    gender: 'male',
    treatment: 'Shell damage. Cleaned and sealed with epoxy resin.',
    by_whom: 'Dr. Smith',
    status: 'active',
    created_at: '2023-05-13T16:20:00Z',
    updated_at: '2023-05-13T16:20:00Z',
  },
  {
    id: 5,
    date: '2023-05-12',
    admission_date: '2023-05-12',
    informer_name: 'David Lee',
    phone: '5432109876',
    animal_type: 'dog',
    gender: 'male',
    treatment: 'Severe mange. Started on medication and medicated baths.',
    by_whom: 'Dr. Johnson',
    status: 'deceased',
    created_at: '2023-05-12T08:10:00Z',
    updated_at: '2023-05-18T17:45:00Z',
  },
];

const mockGetCasePapers = (params: CasePaperListParams): PaginatedResponse<CasePaper> => {
  let filteredPapers = [...mockCasePapers];
  
  // Apply search if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredPapers = filteredPapers.filter(paper => 
      paper.informer_name.toLowerCase().includes(searchLower) ||
      paper.animal_type.toLowerCase().includes(searchLower) ||
      paper.phone.includes(params.search)
    );
  }
  
  // Apply filters if provided
  if (params.filters) {
    if (params.filters.animalType) {
      filteredPapers = filteredPapers.filter(paper => 
        paper.animal_type === params.filters?.animalType
      );
    }
    
    if (params.filters.status) {
      filteredPapers = filteredPapers.filter(paper => 
        paper.status === params.filters?.status
      );
    }
    
    if (params.filters.dateFrom) {
      const fromDate = new Date(params.filters.dateFrom);
      filteredPapers = filteredPapers.filter(paper => 
        new Date(paper.date) >= fromDate
      );
    }
    
    if (params.filters.dateTo) {
      const toDate = new Date(params.filters.dateTo);
      toDate.setHours(23, 59, 59);
      filteredPapers = filteredPapers.filter(paper => 
        new Date(paper.date) <= toDate
      );
    }
  }
  
  // Calculate pagination
  const total = filteredPapers.length;
  const startIndex = (params.page - 1) * params.perPage;
  const endIndex = startIndex + params.perPage;
  const paginatedPapers = filteredPapers.slice(startIndex, endIndex);
  
  return {
    data: paginatedPapers,
    total,
    current_page: params.page,
    per_page: params.perPage,
    last_page: Math.ceil(total / params.perPage)
  };
};

const mockGetCasePaper = (id: number): CasePaper => {
  const paper = mockCasePapers.find(p => p.id === id);
  if (!paper) {
    throw new Error(`Case paper with ID ${id} not found`);
  }
  return paper;
};

const mockCreateCasePaper = (data: CreateCasePaperPayload): CasePaper => {
  const newId = Math.max(...mockCasePapers.map(p => p.id)) + 1;
  const now = new Date().toISOString();
  
  const newPaper: CasePaper = {
    id: newId,
    ...data,
    status: 'active',
    created_at: now,
    updated_at: now,
  };
  
  mockCasePapers.push(newPaper);
  return newPaper;
};

const mockUpdateCasePaper = (id: number, data: UpdateCasePaperPayload): CasePaper => {
  const index = mockCasePapers.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Case paper with ID ${id} not found`);
  }
  
  const updatedPaper: CasePaper = {
    ...mockCasePapers[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  mockCasePapers[index] = updatedPaper;
  return updatedPaper;
};

const mockDeleteCasePaper = (id: number): void => {
  const index = mockCasePapers.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Case paper with ID ${id} not found`);
  }
  
  mockCasePapers.splice(index, 1);
};