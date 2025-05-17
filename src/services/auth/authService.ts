import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Interface for user data
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Interface for authentication response
export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Store token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Store user in localStorage
const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user from localStorage
export const getUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Login user
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { username, password });
    
    // Store token and user data
    setToken(response.data.token);
    setUser(response.data.user);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get authenticated user profile
export const getProfile = async (): Promise<User> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get<{ user: User }>(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

// Create axios instance with auth header
export const authAxios = axios.create();

// Add auth token to all requests
authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
