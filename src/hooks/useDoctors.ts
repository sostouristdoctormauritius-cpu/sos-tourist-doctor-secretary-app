import { useState, useEffect, useCallback } from 'react';
import { fetchDoctors, fetchDoctorById, type FetchDoctorsParams } from '../services/doctors';
import type { Doctor, DoctorsState, Pagination } from '../types/doctor';

export function useDoctors(initialParams: FetchDoctorsParams = {}) {
  const [state, setState] = useState<DoctorsState>({
    doctors: [],
    pagination: null,
    loading: false,
    error: null,
  });

  const [params, setParams] = useState<FetchDoctorsParams>(initialParams);

  const loadDoctors = useCallback(async (fetchParams?: FetchDoctorsParams) => {
    const currentParams = fetchParams || params;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchDoctors(currentParams);
      setState({
        doctors: response.doctors,
        pagination: response.pagination,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [params]);

  const updateParams = useCallback((newParams: Partial<FetchDoctorsParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  const refetch = useCallback(() => {
    loadDoctors();
  }, [loadDoctors]);

  // Load doctors when params change
  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  return {
    ...state,
    params,
    updateParams,
    resetParams,
    refetch,
    loadDoctors,
  };
}

export function useDoctor(id: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctor = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchDoctorById(id);
      setDoctor(response.doctor);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  return {
    doctor,
    loading,
    error,
    refetch: loadDoctor,
  };
}