import { apiRequest } from './api';
import type {
  Doctor,
  DoctorsResponse,
  DoctorsFilters,
  Pagination
} from '../types/doctor';

export interface FetchDoctorsParams extends DoctorsFilters {
  page?: number;
  limit?: number;
}

export async function fetchDoctors(
  params: FetchDoctorsParams = {},
  token?: string
): Promise<DoctorsResponse> {
  const queryParams = new URLSearchParams();

  // Add pagination params
  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }

  // Add filter params
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.specialisation) {
    queryParams.append('specialisation', params.specialisation);
  }
  if (params.language) {
    queryParams.append('language', params.language);
  }
  if (params.minRating !== undefined) {
    queryParams.append('minRating', params.minRating.toString());
  }
  if (params.isListed !== undefined) {
    queryParams.append('isListed', params.isListed.toString());
  }
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const queryString = queryParams.toString();
  const endpoint = `/v1/doctors${queryString ? `?${queryString}` : ''}`;

  return apiRequest<DoctorsResponse>(endpoint, {
    method: 'GET',
    headers,
  });
}

export async function fetchDoctorById(
  id: string,
  token?: string
): Promise<{ doctor: Doctor }> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return apiRequest<{ doctor: Doctor }>(`/v1/doctors/${id}`, {
    method: 'GET',
    headers,
  });
}