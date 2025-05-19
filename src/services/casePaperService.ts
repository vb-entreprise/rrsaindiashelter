import { supabase } from './apiClient';
import { CasePaper } from '../types/casePaper';

interface GetCasePapersParams {
  page: number;
  perPage: number;
  search?: string;
  filters?: {
    animalType?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export const casePaperService = {
  async getCasePapers({ page, perPage, search, filters }: GetCasePapersParams) {
    let query = supabase
      .from('case_papers')
      .select('*', { count: 'exact' });

    // Apply search filter if provided
    if (search) {
      query = query.or(`informer_name.ilike.%${search}%,phone.ilike.%${search}%,animal_type.ilike.%${search}%`);
    }

    // Apply filters
    if (filters) {
      if (filters.animalType) {
        query = query.eq('animal_type', filters.animalType);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }
    }

    // Add pagination
    const start = (page - 1) * perPage;
    query = query
      .range(start, start + perPage - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data,
      total: count || 0,
    };
  },

  async getCasePaper(id: string) {
    const { data, error } = await supabase
      .from('case_papers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createCasePaper(casePaper: Partial<CasePaper>) {
    const { data, error } = await supabase
      .from('case_papers')
      .insert([casePaper])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateCasePaper(id: string, casePaper: Partial<CasePaper>) {
    const { data, error } = await supabase
      .from('case_papers')
      .update(casePaper)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteCasePaper(id: string) {
    const { error } = await supabase
      .from('case_papers')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};