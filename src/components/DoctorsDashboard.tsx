import React, { useState } from 'react';
import { useDoctors } from '../hooks/useDoctors';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { DoctorCard } from './DoctorCard';
import { DoctorFilters } from './DoctorFilters';
import { DoctorPagination } from './DoctorPagination';
import { DoctorModal } from './DoctorModal';
import type { FetchDoctorsParams } from '../services/doctors';
import type { Doctor } from '../types/doctor';

export const DoctorsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<FetchDoctorsParams>({
    page: 1,
    limit: 10,
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    doctors,
    pagination,
    loading,
    error,
    updateParams,
    refetch,
  } = useDoctors(filters);

  const handleFilterChange = (newFilters: Partial<FetchDoctorsParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 when filters change
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={refetch}
        className="m-4"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Doctors Dashboard
        </h1>
        <p className="text-gray-600">
          Browse and manage doctor profiles
        </p>
      </div>

      {/* Filters Section */}
      <DoctorFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading && doctors.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <LoadingSpinner size="sm" className="mx-auto" />
          </div>
        )}

        {error && doctors.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <ErrorMessage message={error} onRetry={refetch} />
          </div>
        )}

        <div className="p-6">
          {doctors.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && <DoctorPagination pagination={pagination} onPageChange={handlePageChange} />}
      </div>

      {/* Doctor Modal */}
      <DoctorModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};