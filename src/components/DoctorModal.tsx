import React from 'react';
import type { Doctor } from '../types/doctor';

interface DoctorModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, isOpen, onClose }) => {
  if (!isOpen || !doctor) return null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
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

  const formatWorkingHours = (hours: object | null) => {
    if (!hours) return 'Not specified';

    try {
      const hoursObj = hours as Record<string, string>;
      return Object.entries(hoursObj)
        .map(([day, time]) => `${day}: ${time}`)
        .join(', ');
    } catch {
      return 'Not specified';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="doctor-modal-title">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start space-x-4">
              <img
                src={doctor.profile_picture || '/default-avatar.png'}
                alt={`${doctor.name} profile`}
                className="w-24 h-24 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 id="doctor-modal-title" className="text-2xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-2">
                      {doctor.doctor_profile.specialisation}
                    </p>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-3" role="img" aria-label={`Rating: ${doctor.doctor_profile.rating} out of 5 stars`}>
                        {renderStars(doctor.doctor_profile.rating)}
                      </div>
                      <span className="text-lg text-gray-700 font-medium">
                        {doctor.doctor_profile.rating}
                      </span>
                      <span className="text-gray-600 ml-1">
                        ({doctor.doctor_profile.rating_count} reviews)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</h4>
                        <p className="text-gray-900">{doctor.email}</p>
                        <p className="text-gray-900">{doctor.phone}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          doctor.doctor_profile.is_listed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {doctor.doctor_profile.is_listed ? 'Listed' : 'Unlisted'}
                        </span>
                      </div>
                    </div>

                    {doctor.doctor_profile.address && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</h4>
                        <p className="text-gray-900">{doctor.doctor_profile.address}</p>
                      </div>
                    )}

                    {doctor.doctor_profile.supported_languages && doctor.doctor_profile.supported_languages.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.doctor_profile.supported_languages.map((lang) => (
                            <span
                              key={lang}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {doctor.doctor_profile.working_hours && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Working Hours</h4>
                        <p className="text-gray-900">{formatWorkingHours(doctor.doctor_profile.working_hours)}</p>
                      </div>
                    )}

                    {doctor.doctor_profile.bio && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">About</h4>
                        <p className="text-gray-900 leading-relaxed">{doctor.doctor_profile.bio}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      <p>Member since: {new Date(doctor.created_at).toLocaleDateString()}</p>
                      <p>Last updated: {new Date(doctor.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};