export interface DoctorProfile {
  specialisation: string;
  rating: number;
  rating_count: number;
  address: string | null;
  working_hours: object | null;
  bio: string | null;
  is_listed: boolean;
  supported_languages: string[] | null;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
  is_status: 'active' | 'pending' | 'blocked';
  created_at: string;
  updated_at: string;
  doctor_profile: DoctorProfile;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DoctorsResponse {
  doctors: Doctor[];
  pagination: Pagination;
}

export interface DoctorsFilters {
  search?: string;
  specialisation?: string;
  language?: string;
  minRating?: number;
  isListed?: boolean;
  sortBy?: 'rating' | 'rating_count' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface DoctorsState {
  doctors: Doctor[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}