# 👩‍💼 Secretary Website - Integration Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Appointment Management](#appointment-management)
5. [Patient Management](#patient-management)
6. [Doctor Management](#doctor-management)
7. [Payment Processing](#payment-processing)
8. [Chat System](#chat-system)
9. [Medical Records](#medical-records)
10. [Dashboard & Analytics](#dashboard--analytics)
11. [API Integration Examples](#api-integration-examples)
12. [Error Handling](#error-handling)
13. [Best Practices](#best-practices)

---

## 🎯 Overview

### **Application Purpose**
The Secretary Website is a comprehensive administrative interface for clinic/hospital staff to manage:
- Patient appointments and scheduling
- Doctor availability and profiles
- Medical records management
- Payment processing and tracking
- Patient communication and support
- Administrative tasks and reporting

### **Target Users**
- Clinic receptionists
- Hospital administrative staff
- Medical office managers
- Healthcare coordinators

### **Key Features**
- ✅ Multi-doctor appointment management
- ✅ Patient registration and management
- ✅ Medical records coordination
- ✅ Payment processing
- ✅ Doctor schedule management
- ✅ Real-time chat with patients
- ✅ Administrative reporting
- ✅ Multi-language support

### **Technology Stack**
- **Frontend**: React.js / Next.js (recommended)
- **Authentication**: JWT tokens + Session management
- **API Integration**: RESTful API calls
- **Real-time**: WebSocket for live updates
- **UI Framework**: Material-UI / Ant Design / Custom

---

## 🔐 Authentication

### **Login Process**

#### **1. Email/Password Authentication**
```javascript
// Login endpoint
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/email/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      return {
        success: true,
        user: data.user,
        token: data.access_token
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **2. Token Management**
```javascript
// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user_data');

  if (!token || !userData) {
    return false;
  }

  // Check token expiration
  try {
    const user = JSON.parse(userData);
    return user.role === 'secretary' && user.is_status === 'active';
  } catch {
    return false;
  }
};

// Get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
```

### **Authentication Response Format**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "secretary@clinic.com",
    "name": "Jane Smith",
    "role": "secretary",
    "profile_picture": null,
    "is_email_verified": true,
    "is_status": "active",
    "associated_doctors": ["doctor-id-1", "doctor-id-2"]
  }
}
```

---

## 👥 User Management

### **Secretary-Specific Operations**

#### **Get Secretary Profile**
```javascript
const getSecretaryProfile = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/me', {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        profile: data.user
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Update Secretary Profile**
```javascript
const updateSecretaryProfile = async (profileData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        profile: data.user
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

---

## 📅 Appointment Management

### **Core Appointment Operations**

#### **List All Appointments**
```javascript
const getAllAppointments = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      status: filters.status || '',
      doctorId: filters.doctorId || '',
      date: filters.date || ''
    });

    const response = await fetch(`http://localhost:3000/api/v1/appointments?${queryParams}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        appointments: data.appointments,
        total: data.total
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Create New Appointment**
```javascript
const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/appointments', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        user_id: appointmentData.patientId,
        doctor_id: appointmentData.doctorId,
        date: appointmentData.date,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        consultation_type: appointmentData.type,
        symptoms: appointmentData.symptoms,
        additional_note: appointmentData.notes
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        appointment: data.appointment
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Update Appointment Status**
```javascript
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        appointment: data.appointment
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

### **Appointment Data Structure**
```json
{
  "id": "uuid",
  "user_id": "patient-uuid",
  "doctor_id": "doctor-uuid",
  "date": "2025-11-15",
  "start_time": "10:00",
  "end_time": "10:30",
  "status": "confirmed",
  "consultation_type": "video",
  "symptoms": ["Headache", "Fever"],
  "additional_note": "Patient requests video consultation",
  "created_at": "2025-10-26T12:00:00Z",
  "updated_at": "2025-10-26T12:00:00Z"
}
```

---

## 🏥 Patient Management

### **Patient Operations**

#### **Register New Patient**
```javascript
const registerPatient = async (patientData) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        role: 'patient',
        is_status: 'active'
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        patient: data.user
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Get Patient List**
```javascript
const getPatients = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/users?role=patient&page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        patients: data.users,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

---

## 👨‍⚕️ Doctor Management

### **Doctor Operations**

#### **Get Associated Doctors**
```javascript
const getAssociatedDoctors = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/doctors', {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        doctors: data.doctors
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Get Doctor Schedule**
```javascript
const getDoctorSchedule = async (doctorId, date) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/appointments/doctor/${doctorId}/schedule?date=${date}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        schedule: data.schedule
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

### **Doctor Data Structure**
```json
{
  "id": "uuid",
  "user_id": "doctor-user-uuid",
  "specialisation": "General Medicine",
  "rating": 4.8,
  "rating_count": 25,
  "address": "Medical Center, 789 Medical Blvd",
  "working_hours": {
    "monday": { "start": "09:00", "end": "17:00" },
    "tuesday": { "start": "09:00", "end": "17:00" }
  },
  "bio": "Experienced general physician",
  "is_listed": true,
  "supported_languages": ["English", "French"],
  "created_at": "2025-10-26T12:00:00Z",
  "updated_at": "2025-10-26T12:00:00Z"
}
```

---

## 💳 Payment Processing

### **Payment Operations**

#### **Get Payment History**
```javascript
const getPaymentHistory = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      status: filters.status || '',
      userId: filters.userId || '',
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || ''
    });

    const response = await fetch(`http://localhost:3000/api/v1/payments?${queryParams}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        payments: data.payments,
        total: data.total
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Process Payment**
```javascript
const processPayment = async (appointmentId, paymentMethod) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/payments/create-payment-intent', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        appointment_id: appointmentId,
        payment_method: paymentMethod
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        paymentIntent: data.paymentIntent
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

### **Payment Data Structure**
```json
{
  "id": "uuid",
  "appointment_id": "appointment-uuid",
  "user_id": "patient-uuid",
  "amount": 75.00,
  "currency": "USD",
  "status": "succeeded",
  "payment_method": "card",
  "stripe_payment_intent_id": "pi_mock123",
  "paid_at": "2025-10-26T12:00:00Z",
  "created_at": "2025-10-26T12:00:00Z",
  "updated_at": "2025-10-26T12:00:00Z"
}
```

---

## 💬 Chat System

### **Communication Features**

#### **Get Conversations**
```javascript
const getConversations = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/chat/conversations', {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        conversations: data.conversations
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Send Message**
```javascript
const sendMessage = async (conversationId, message, appointmentId) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/chat/messages', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        conversation_id: conversationId,
        message: message,
        appointment_id: appointmentId
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

### **Chat Data Structure**
```json
{
  "id": "uuid",
  "conversation_id": "conv_123",
  "sender_id": "secretary-uuid",
  "message": "Hello, your appointment is confirmed",
  "attachments": [],
  "status": "sent",
  "created_at": "2025-10-26T12:00:00Z",
  "updated_at": "2025-10-26T12:00:00Z"
}
```

---

## 📊 Dashboard & Analytics

### **Administrative Reports**

#### **Get Dashboard Statistics**
```javascript
const getDashboardStats = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/admin/dashboard/stats', {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        stats: {
          totalAppointments: data.totalAppointments,
          todayAppointments: data.todayAppointments,
          totalPatients: data.totalPatients,
          totalDoctors: data.totalDoctors,
          totalRevenue: data.totalRevenue,
          pendingPayments: data.pendingPayments
        }
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

#### **Get Recent Activity**
```javascript
const getRecentActivity = async (limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/admin/dashboard/recent-activity?limit=${limit}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        activities: data.activities
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
};
```

---

## 🛠️ API Integration Examples

### **Complete Patient Registration Flow**

```javascript
class SecretaryAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  // Authentication
  async login(email, password) {
    const response = await fetch(`${this.baseURL}/api/v1/auth/email/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      this.token = data.access_token;
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
    }

    return data;
  }

  // Patient Management
  async registerPatient(patientData) {
    const response = await fetch(`${this.baseURL}/api/v1/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        role: 'patient'
      })
    });

    return await response.json();
  }

  async bookAppointment(appointmentData) {
    const response = await fetch(`${this.baseURL}/api/v1/appointments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user_id: appointmentData.patientId,
        doctor_id: appointmentData.doctorId,
        date: appointmentData.date,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        consultation_type: appointmentData.type,
        symptoms: appointmentData.symptoms
      })
    });

    return await response.json();
  }

  async processPayment(appointmentId, amount) {
    const response = await fetch(`${this.baseURL}/api/v1/payments/create-payment-intent`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        appointment_id: appointmentId,
        amount: amount,
        currency: 'USD'
      })
    });

    return await response.json();
  }

  // Utility methods
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Usage example
const secretaryAPI = new SecretaryAPI();

// Login
await secretaryAPI.login('secretary@clinic.com', 'password');

// Register patient
const patient = await secretaryAPI.registerPatient({
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1234567890'
});

// Book appointment
const appointment = await secretaryAPI.bookAppointment({
  patientId: patient.user.id,
  doctorId: 'doctor-id',
  date: '2025-11-15',
  startTime: '10:00',
  endTime: '10:30',
  type: 'video',
  symptoms: ['General checkup']
});

// Process payment
const payment = await secretaryAPI.processPayment(appointment.appointment.id, 75.00);
```

---

## ❌ Error Handling

### **HTTP Status Codes**

| Code | Description | Action Required |
|------|-------------|-----------------|
| 200 | Success | Process response data |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Check authentication token |
| 403 | Forbidden | Check user permissions |
| 404 | Not Found | Verify resource ID |
| 422 | Validation Error | Check data format |
| 429 | Rate Limited | Implement retry logic |
| 500 | Server Error | Retry or contact support |

### **Error Response Format**
```json
{
  "error": "Error description",
  "details": "Additional error information",
  "debug": {
    "requestId": "req_123",
    "timestamp": "2025-10-26T12:00:00Z"
  }
}
```

### **Error Handling Best Practices**

```javascript
const handleAPIError = (error) => {
  switch (error.status) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 403:
      // Show permission error
      showNotification('Access denied', 'error');
      break;
    case 422:
      // Highlight validation errors
      highlightFormErrors(error.details);
      break;
    case 429:
      // Show rate limit message
      showNotification('Too many requests. Please try again later.', 'warning');
      break;
    default:
      // Generic error handling
      showNotification('An error occurred. Please try again.', 'error');
  }
};
```

---

## 📋 Best Practices

### **1. Authentication Management**
- Store tokens securely (httpOnly cookies recommended)
- Implement automatic token refresh
- Handle token expiration gracefully
- Clear tokens on logout

### **2. API Communication**
- Use consistent error handling
- Implement retry logic for network failures
- Cache frequently accessed data
- Use pagination for large datasets

### **3. User Experience**
- Show loading states during API calls
- Provide clear feedback for user actions
- Implement optimistic updates where appropriate
- Handle offline scenarios

### **4. Data Management**
- Validate all user input
- Sanitize data before display
- Implement proper form validation
- Handle file uploads securely

### **5. Security**
- Never store sensitive data in localStorage
- Use HTTPS for all API communications
- Validate all data from API responses
- Implement CSRF protection

### **6. Performance**
- Implement efficient state management
- Use React Query or SWR for data fetching
- Optimize bundle size
- Implement code splitting

---

## 🚀 Quick Start Implementation

### **1. Basic Setup**
```javascript
// src/api/secretaryAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **2. Authentication Service**
```javascript
// src/services/authService.js
import api from '../api/secretaryAPI';

export const authService = {
  async login(credentials) {
    const response = await api.post('/api/v1/auth/email/login', credentials);
    return response.data;
  },

  async logout() {
    await api.post('/api/v1/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  },

  async getCurrentUser() {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  }
};
```

### **3. Appointment Service**
```javascript
// src/services/appointmentService.js
import api from '../api/secretaryAPI';

export const appointmentService = {
  async getAll(filters = {}) {
    const response = await api.get('/api/v1/appointments', { params: filters });
    return response.data;
  },

  async create(appointmentData) {
    const response = await api.post('/api/v1/appointments', appointmentData);
    return response.data;
  },

  async update(appointmentId, updates) {
    const response = await api.put(`/api/v1/appointments/${appointmentId}`, updates);
    return response.data;
  },

  async updateStatus(appointmentId, status) {
    const response = await api.patch(`/api/v1/appointments/${appointmentId}/status`, { status });
    return response.data;
  }
};
```

---

## 📞 Support & Integration Help

### **API Documentation**
- **Base URL**: `http://localhost:3000` (development)
- **Authentication**: Bearer token required for protected endpoints
- **Response Format**: JSON
- **Error Handling**: Consistent error response format

### **Integration Support**
- **Email**: devenpawaray@outlook.com
- **Phone**: +230 5816 9420
- **Documentation**: Complete API reference available

### **Testing Credentials**
- **Secretary Email**: `devenpawaray@outlook.com`
- **Secretary Password**: `Deven123!`
- **Test Patient**: `patient1@example.com` / `Patient123!`
- **Test Doctor**: `doctor@example.com` / `Doctor123!`

---

## ✅ Integration Checklist

- [ ] Set up authentication system
- [ ] Implement token management
- [ ] Create appointment management interface
- [ ] Add patient registration functionality
- [ ] Implement payment processing
- [ ] Add chat/messaging features
- [ ] Create dashboard and reporting
- [ ] Implement error handling
- [ ] Add loading states and UX improvements
- [ ] Test all functionality
- [ ] Deploy to production

---

**🎉 Secretary Website Integration Guide - Complete!**

*This guide provides everything needed to build a comprehensive secretary website that integrates seamlessly with the SOS Tourist Doctor API. All endpoints, data structures, and integration examples are included.*

*For additional support or questions, contact the system developer.*