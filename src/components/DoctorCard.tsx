import React from 'react';
import type { Doctor } from '../types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewProfile }) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <img
          src={doctor.profile_picture || '/default-avatar.png'}
          alt={`${doctor.name} profile`}
          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {doctor.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm mb-2">
                {doctor.doctor_profile.specialisation}
              </p>

              <div className="flex items-center mb-3">
                <div className="flex items-center mr-2" role="img" aria-label={`Rating: ${doctor.doctor_profile.rating} out of 5 stars`}>
                  {renderStars(doctor.doctor_profile.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {doctor.doctor_profile.rating} ({doctor.doctor_profile.rating_count} reviews)
                </span>
              </div>

              {doctor.doctor_profile.bio && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {doctor.doctor_profile.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {doctor.doctor_profile.supported_languages?.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end space-y-2 mt-2 sm:mt-0">
              <div className="text-sm text-gray-500">
                {doctor.doctor_profile.is_listed ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Listed
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Unlisted
                  </span>
                )}
              </div>
              <button
                onClick={() => onViewProfile(doctor)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label={`View full profile for ${doctor.name}`}
              >
                View Profile
                <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};