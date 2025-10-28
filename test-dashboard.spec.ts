import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DoctorsDashboard } from './src/components/DoctorsDashboard';

// Mock the API calls
jest.mock('./src/services/doctors', () => ({
  fetchDoctors: jest.fn(),
}));

jest.mock('./src/hooks/useDoctors', () => ({
  useDoctors: jest.fn(),
}));

const mockUseDoctors = require('./src/hooks/useDoctors').useDoctors;
const mockFetchDoctors = require('./src/services/doctors').fetchDoctors;

describe('DoctorsDashboard', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockUseDoctors.mockReturnValue({
      doctors: [],
      pagination: null,
      loading: true,
      error: null,
      updateParams: jest.fn(),
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    expect(screen.getByText('Doctors Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  test('renders error state when API fails', () => {
    mockUseDoctors.mockReturnValue({
      doctors: [],
      pagination: null,
      loading: false,
      error: 'Failed to fetch doctors',
      updateParams: jest.fn(),
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch doctors')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  test('renders doctors list when data is available', () => {
    const mockDoctors = [
      {
        id: '1',
        name: 'Dr. John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        profile_picture: 'https://example.com/avatar.jpg',
        is_status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        doctor_profile: {
          specialisation: 'Cardiology',
          rating: 4.5,
          rating_count: 10,
          address: '123 Main St',
          working_hours: null,
          bio: 'Experienced cardiologist',
          is_listed: true,
          supported_languages: ['English', 'French'],
        },
      },
    ];

    mockUseDoctors.mockReturnValue({
      doctors: mockDoctors,
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      loading: false,
      error: null,
      updateParams: jest.fn(),
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('handles filter changes', () => {
    const mockUpdateParams = jest.fn();

    mockUseDoctors.mockReturnValue({
      doctors: [],
      pagination: null,
      loading: false,
      error: null,
      updateParams: mockUpdateParams,
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    const searchInput = screen.getByPlaceholderText('Search by name, specialization...');
    fireEvent.change(searchInput, { target: { value: 'cardiology' } });

    expect(mockUpdateParams).toHaveBeenCalledWith({ search: 'cardiology', page: 1 });
  });

  test('opens doctor modal when View Profile is clicked', () => {
    const mockDoctors = [
      {
        id: '1',
        name: 'Dr. John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        profile_picture: 'https://example.com/avatar.jpg',
        is_status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        doctor_profile: {
          specialisation: 'Cardiology',
          rating: 4.5,
          rating_count: 10,
          address: '123 Main St',
          working_hours: null,
          bio: 'Experienced cardiologist',
          is_listed: true,
          supported_languages: ['English', 'French'],
        },
      },
    ];

    mockUseDoctors.mockReturnValue({
      doctors: mockDoctors,
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      loading: false,
      error: null,
      updateParams: jest.fn(),
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    const viewProfileButton = screen.getByRole('button', { name: /View Profile for Dr. John Doe/i });
    fireEvent.click(viewProfileButton);

    // Modal should be open - check for modal content
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  test('handles pagination', () => {
    const mockUpdateParams = jest.fn();

    mockUseDoctors.mockReturnValue({
      doctors: [],
      pagination: { page: 1, limit: 10, total: 25, totalPages: 3 },
      loading: false,
      error: null,
      updateParams: mockUpdateParams,
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    // Assuming pagination component renders page buttons
    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Button);

    expect(mockUpdateParams).toHaveBeenCalledWith({ page: 2 });
  });

  test('displays no doctors message when list is empty', () => {
    mockUseDoctors.mockReturnValue({
      doctors: [],
      pagination: null,
      loading: false,
      error: null,
      updateParams: jest.fn(),
      refetch: jest.fn(),
    });

    render(<DoctorsDashboard />);

    expect(screen.getByText('No doctors found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or search terms')).toBeInTheDocument();
  });

  test('handles retry on error', () => {
    const mockRefetch = jest.fn();

    mockUseDoctors.mockReturnValue({
      doctors: [],
      pagination: null,
      loading: false,
      error: 'Network error',
      updateParams: jest.fn(),
      refetch: mockRefetch,
    });

    render(<DoctorsDashboard />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });
});