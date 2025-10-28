import React from 'react';
import { createRoot } from 'react-dom/client';
import { DoctorsDashboard } from './components/DoctorsDashboard';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DoctorsDashboard />);
}