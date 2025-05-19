/**
 * CasePaper type definition
 */
export interface CasePaper {
  id: number;
  date: string;
  admission_date?: string;
  informer_name: string;
  phone: string;
  alt_phone?: string;
  aadhar?: string;
  animal_type: string;
  animal_name?: string;
  gender: string;
  treatment: string;
  by_whom: string;
  status: 'active' | 'discharged' | 'deceased';
  created_at: string;
  updated_at: string;
}

/**
 * CreateCasePaper type definition for the request payload
 */
export interface CreateCasePaperPayload {
  date: string;
  admission_date?: string;
  informer_name: string;
  phone: string;
  alt_phone?: string;
  aadhar?: string;
  animal_type: string;
  animal_name?: string;
  gender: string;
  treatment: string;
  by_whom: string;
}

/**
 * UpdateCasePaper type extends the create payload with status
 */
export interface UpdateCasePaperPayload extends CreateCasePaperPayload {
  status: 'active' | 'discharged' | 'deceased';
}

/**
 * CasePaperFilters type for filtering the case paper list
 */
export interface CasePaperFilters {
  animalType?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * CasePaperListParams type for the GET request parameters
 */
export interface CasePaperListParams {
  page: number;
  perPage: number;
  search?: string;
  filters?: CasePaperFilters;
}

/**
 * PaginatedResponse type for paginated API responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}