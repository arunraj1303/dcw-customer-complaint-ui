const API_BASE =  'http://127.0.0.1:4000';

const TOKEN_KEY = 'skanda_token';

type ApiError = {
  code?: string;
  details?: unknown;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || body.success === false) {
    throw new Error(body.message || 'Request failed');
  }

  return body.data as T;
};

export type EmployeeDTO = {
  id: number;
  empCode?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  position?: string | null;
  joinDate?: string | null;
  employeeType: 'Permanent' | 'Internship' | 'Contract';
  avatarUrl?: string | null;
  projectType?: string | null;
};

export type LeaveDTO = {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: number | null;
};

export type PermissionDTO = {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason?: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: number | null;
};

export type TimesheetDTO = {
  id: number;
  employeeId: number;
  workDate: string;
  hours: number;
  project: string;
  task: string;
  details?: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: number | null;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'employee';
    empId?: string | null;
  };
};

export const api = {
  login1: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ "username":email, password }),
    }),


  getEmployees: () => request<EmployeeDTO[]>('/employees'),


  getLeaves: () => request<LeaveDTO[]>('/leaves'),
  getPermissions: () => request<PermissionDTO[]>('/permissions'),
  getTimesheets: () => request<TimesheetDTO[]>('/timesheets'),

  createEmployee: (payload: Partial<EmployeeDTO>) =>
    request<EmployeeDTO>('/employees', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateEmployee: (id: number, payload: Partial<EmployeeDTO>) =>
    request<EmployeeDTO>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteEmployee: (id: number) =>
    request<void>(`/employees/${id}`, { method: 'DELETE' }),

  createLeave: (payload: Partial<LeaveDTO>) =>
    request<LeaveDTO>('/leaves', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateLeave: (id: number, payload: Partial<LeaveDTO>) =>
    request<LeaveDTO>(`/leaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteLeave: (id: number) => request<void>(`/leaves/${id}`, { method: 'DELETE' }),

  // Approve leave (admin)
  approveLeave: (id: number, approverId: number) =>
    request<LeaveDTO>(`/leaves/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ approverId }),
    }),

  createPermission: (payload: Partial<PermissionDTO>) =>
    request<PermissionDTO>('/permissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updatePermission: (id: number, payload: Partial<PermissionDTO>) =>
    request<PermissionDTO>(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deletePermission: (id: number) =>
    request<void>(`/permissions/${id}`, { method: 'DELETE' }),

  createTimesheet: (payload: Partial<TimesheetDTO>) =>
    request<TimesheetDTO>('/timesheets', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

    
  updateTimesheet: (id: number, payload: Partial<TimesheetDTO>) =>
    request<TimesheetDTO>(`/timesheets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      
    }),


  deleteTimesheet: (id: number) =>
    request<void>(`/timesheets/${id}`, { method: 'DELETE' }),
};
