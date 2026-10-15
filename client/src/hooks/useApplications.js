import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  uploadResume,
  downloadResume,
  deleteResume,
} from '../services/application.service';

// ─── Query Keys ───────────────────────────────────────────────
const KEYS = {
  all:    ['applications'],
  detail: (id) => ['applications', id],
};

// Dashboard stats/charts are derived from applications data, but they live
// under a separate query key (see useDashboard.js) — any mutation here that
// changes counts/status must invalidate this too, or the dashboard goes stale
// until a full page reload wipes the whole cache.
const DASHBOARD_KEY = ['dashboard'];

// ─── Queries ──────────────────────────────────────────────────
export const useApplications = () =>
  useQuery({ queryKey: KEYS.all, queryFn: getApplications });

export const useApplication = (id) =>
  useQuery({ queryKey: KEYS.detail(id), queryFn: () => getApplicationById(id), enabled: !!id });

// ─── Mutations ────────────────────────────────────────────────
export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }) => uploadResume(id, file),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: KEYS.detail(id) }),
  });
};

export const useDownloadResume = () =>
  useMutation({ mutationFn: (id) => downloadResume(id) });

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteResume(id),
    onSuccess: (_, id) => queryClient.invalidateQueries({ queryKey: KEYS.detail(id) }),
  });
};


//useQuery = for reading 
//useMutation = for changing
//invalidateQueries = for refreshing stale data:When you create/update/delete something,
//  the cached list is now outdated. invalidateQueries tells TanStack: "throw away this cached data and refetch it".

// Component calls useStats()
//         │
//    is ['dashboard','stats'] in cache and fresh (< 5 min old)?
//         │
//    yes ──────────────► return cached data instantly, no network call
//         │
//    no
//         ▼
//    call getStats()  →  dashboard.service.js  →  api.js  →  backend
//         │
//    store result under ['dashboard','stats'], mark it fresh
//         │
//    component re-renders with { data, isLoading: false }


// Component calls useCreateApplication().mutate(formData)
//         │
//    createApplication(formData) → POST /api/applications
//         │
//    success? → invalidateQueries(['applications'])
//         │
//    any component using useApplications() auto-refetches
//         │
//    UI updates everywhere, automatically
