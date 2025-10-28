import React from 'react';
import type { FetchDoctorsParams } from '../services/doctors';

interface DoctorFiltersProps {
  filters: FetchDoctorsParams;
  onFilterChange: (filters: Partial<FetchDoctorsParams>) => void;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({ filters, onFilterChange }) => {
  const handleInputChange = (field: keyof FetchDoctorsParams, value: string | number | boolean | undefined) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, specialization..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value || undefined)}
            aria-describedby="search-help"
          />
          <span id="search-help" className="sr-only">Search doctors by name or specialization</span>
        </div>

        <div>
          <label htmlFor="specialisation" className="block text-sm font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <input
            id="specialisation"
            type="text"
            placeholder="e.g., Cardiology"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.specialisation || ''}
            onChange={(e) => handleInputChange('specialisation', e.target.value || undefined)}
            aria-describedby="specialisation-help"
          />
          <span id="specialisation-help" className="sr-only">Filter by medical specialization</span>
        </div>

        <div>
          <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">
            Min Rating
          </label>
          <select
            id="minRating"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.minRating || ''}
            onChange={(e) => handleInputChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
            aria-describedby="rating-help"
          >
            <option value="">Any Rating</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
          <span id="rating-help" className="sr-only">Filter doctors by minimum star rating</span>
        </div>

        <div>
          <label htmlFor="isListed" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="isListed"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.isListed === undefined ? '' : filters.isListed.toString()}
            onChange={(e) => handleInputChange('isListed', e.target.value === '' ? undefined : e.target.value === 'true')}
            aria-describedby="status-help"
          >
            <option value="">All Doctors</option>
            <option value="true">Listed Only</option>
            <option value="false">Unlisted Only</option>
          </select>
          <span id="status-help" className="sr-only">Filter by listing status</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <input
            id="language"
            type="text"
            placeholder="e.g., English, French"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.language || ''}
            onChange={(e) => handleInputChange('language', e.target.value || undefined)}
            aria-describedby="language-help"
          />
          <span id="language-help" className="sr-only">Filter by supported languages</span>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.sortBy || 'rating'}
            onChange={(e) => handleInputChange('sortBy', e.target.value as 'rating' | 'rating_count' | 'created_at')}
            aria-describedby="sort-help"
          >
            <option value="rating">Rating</option>
            <option value="rating_count">Review Count</option>
            <option value="created_at">Date Added</option>
          </select>
          <span id="sort-help" className="sr-only">Sort doctors by selected criteria</span>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <select
            id="sortOrder"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleInputChange('sortOrder', e.target.value as 'asc' | 'desc')}
            aria-describedby="order-help"
          >
            <option value="desc">Highest First</option>
            <option value="asc">Lowest First</option>
          </select>
          <span id="order-help" className="sr-only">Choose ascending or descending sort order</span>
        </div>
      </div>
    </div>
  );
};