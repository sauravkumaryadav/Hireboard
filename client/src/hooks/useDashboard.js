import { useQuery } from '@tanstack/react-query';
import {
  getStats,
  getWeeklyTrend,
  getByStatus,
  getBySource,
  getResponseTime,
} from '../services/dashboard.service';

export const useStats        = () => useQuery({ queryKey: ['dashboard', 'stats'],         queryFn: getStats });
export const useWeeklyTrend  = () => useQuery({ queryKey: ['dashboard', 'weekly-trend'],  queryFn: getWeeklyTrend });
export const useByStatus     = () => useQuery({ queryKey: ['dashboard', 'by-status'],     queryFn: getByStatus });
export const useBySource     = () => useQuery({ queryKey: ['dashboard', 'by-source'],     queryFn: getBySource });
export const useResponseTime = () => useQuery({ queryKey: ['dashboard', 'response-time'], queryFn: getResponseTime });


// Dashboard.jsx
//       ↓
// useDashboard Hook
//       ↓
// dashboard.service.js
//       ↓
// Axios Instance
//       ↓
// Backend API
//       ↓
// MongoDB
//       ↓
// React Query Cache
//       ↓
// UI