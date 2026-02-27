export const TOKEN_KEY = 'auth_token';
export const API_BASE = 'http://localhost:6200';

type ErrorCallback = (msg: string) => void;
let globalErrorCallback: ErrorCallback | null = null;

export const registerGlobalErrorHandler = (callback: ErrorCallback) => {
  globalErrorCallback = callback;
};

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => localStorage.getItem(TOKEN_KEY);

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// RequestInit-ai extend panni 'params' support add seiyappattullathu
interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export const request = async <T>(path: string, options?: RequestOptions): Promise<T> => {
  const token = getToken();
  let fullPath = path;

  // 1. Handling GET Query Parameters
  if (options?.params && Object.keys(options.params).length > 0) {
    // Empty strings matrum null values-ai filter seigirom
    const cleanParams: Record<string, string> = {};
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });

    const queryString = new URLSearchParams(cleanParams).toString();
    if (queryString) {
      fullPath += (fullPath.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${fullPath}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      clearToken();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    const body: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      message: 'Invalid JSON response from server',
      data: null as unknown as T,
    }));

    if (!res.ok || body.success === false) {
      const errMsg = body.message || 'Request failed';
      globalErrorCallback?.(errMsg);
      throw new Error(errMsg);
    }

    return body.data;
  } catch (err: any) {
    const msg = err.message || 'Network Error';
    globalErrorCallback?.(msg);
    throw new Error(msg);
  }
};