import axios from 'axios';
import { getAccessToken, removeTokens } from './auth';
import type {
    ApiResponse,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    User,
    Driver,
    Vehicle,
    Assignment,
    QueryDriversParams,
    QueryAssignmentsParams,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and data unwrapping
api.interceptors.response.use(
    (response) => {
        // If the response has a 'data' property that is an array (common for lists in this backend),
        // or if it's an object with 'data' property (common for single items),
        // we might want to unwrap it.
        // However, our API methods below are typed to expect ApiResponse<T>.
        // let's keep it simple and just return the response, but we need to fix the methods below
        // to correctly access .data.data
        return response;
    },
    (error) => {
        // Only redirect to login if:
        // 1. It's a 401 error
        // 2. We're not already on the login/register page
        // 3. The user has a token (meaning they were authenticated before)
        if (error.response?.status === 401) {
            const token = getAccessToken();
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

            // Only redirect if user was logged in and we're not on auth pages
            if (token && !currentPath.includes('/login') && !currentPath.includes('/register')) {
                removeTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<ApiResponse<AuthResponse>>(
            '/api/v1/auth/login',
            credentials
        );
        return data.data!;
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const { data } = await api.post<ApiResponse<AuthResponse>>(
            '/api/v1/auth/register',
            userData
        );
        return data.data!;
    },

    getProfile: async (): Promise<User> => {
        const { data } = await api.get<ApiResponse<User>>('/api/v1/auth/profile');
        return data.data!;
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const { data } = await api.post<ApiResponse<AuthResponse>>(
            '/api/v1/auth/refresh',
            { refreshToken }
        );
        return data.data!;
    },
};

// Drivers API
// Drivers API
export const driversAPI = {
    getAll: async (params?: QueryDriversParams): Promise<Driver[]> => {
        try {
            const response = await api.get<ApiResponse<Driver[]>>('/api/v1/drivers', {
                params,
            });

            const dataObj = response.data as any;

            // Check for paginated structure with 'drivers' key
            if (dataObj?.data?.drivers && Array.isArray(dataObj.data.drivers)) {
                return dataObj.data.drivers;
            }
            // Check for simple array in data.data
            if (dataObj?.data && Array.isArray(dataObj.data)) {
                return dataObj.data;
            }
            // Check for array at root data
            if (Array.isArray(dataObj)) {
                return dataObj;
            }

            console.error('Drivers API returned non-array:', response.data);
            return [];
        } catch (error) {
            console.error('Drivers API error:', error);
            return [];
        }
    },

    getById: async (id: string): Promise<Driver> => {
        const { data } = await api.get<ApiResponse<Driver>>(
            `/api/v1/drivers/${id}`
        );
        return data.data!;
    },

    create: async (driverData: Partial<Driver>): Promise<Driver> => {
        const { data } = await api.post<ApiResponse<Driver>>(
            '/api/v1/drivers',
            driverData
        );
        return data.data!;
    },

    update: async (id: string, driverData: Partial<Driver>): Promise<Driver> => {
        const { data } = await api.patch<ApiResponse<Driver>>(
            `/api/v1/drivers/${id}`,
            driverData
        );
        return data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/v1/drivers/${id}`);
    },
};

// Vehicles API
export const vehiclesAPI = {
    getAll: async (): Promise<Vehicle[]> => {
        try {
            const response = await api.get<ApiResponse<Vehicle[]>>('/api/v1/vehicles');

            const dataObj = response.data as any;

            // Check for paginated structure with 'vehicles' key
            if (dataObj?.data?.vehicles && Array.isArray(dataObj.data.vehicles)) {
                return dataObj.data.vehicles;
            }
            // Check for simple array in data.data
            if (dataObj?.data && Array.isArray(dataObj.data)) {
                return dataObj.data;
            }
            // Check for array at root data
            if (Array.isArray(dataObj)) {
                return dataObj;
            }

            console.error('Vehicles API returned non-array:', response.data);
            return [];
        } catch (error) {
            console.error('Vehicles API error:', error);
            return [];
        }
    },

    getById: async (id: string): Promise<Vehicle> => {
        const { data } = await api.get<ApiResponse<Vehicle>>(
            `/api/v1/vehicles/${id}`
        );
        return data.data!;
    },

    create: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
        const { data } = await api.post<ApiResponse<Vehicle>>(
            '/api/v1/vehicles',
            vehicleData
        );
        return data.data!;
    },

    update: async (
        id: string,
        vehicleData: Partial<Vehicle>
    ): Promise<Vehicle> => {
        const { data } = await api.patch<ApiResponse<Vehicle>>(
            `/api/v1/vehicles/${id}`,
            vehicleData
        );
        return data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/v1/vehicles/${id}`);
    },
};

// Assignments API
export const assignmentsAPI = {
    getAll: async (params?: QueryAssignmentsParams): Promise<Assignment[]> => {
        try {
            const response = await api.get<ApiResponse<Assignment[]>>(
                '/api/v1/assignments',
                { params }
            );

            const dataObj = response.data as any;

            // Check for paginated structure with 'assignments' key
            if (dataObj?.data?.assignments && Array.isArray(dataObj.data.assignments)) {
                return dataObj.data.assignments;
            }
            // Check for simple array in data.data
            if (dataObj?.data && Array.isArray(dataObj.data)) {
                return dataObj.data;
            }
            // Check for array at root data
            if (Array.isArray(dataObj)) {
                return dataObj;
            }

            console.error('Assignments API returned non-array:', response.data);
            return [];
        } catch (error) {
            console.error('Assignments API error:', error);
            return [];
        }
    },

    getById: async (id: string): Promise<Assignment> => {
        const { data } = await api.get<ApiResponse<Assignment>>(
            `/api/v1/assignments/${id}`
        );
        return data.data!;
    },

    create: async (assignmentData: {
        driverId: string;
        vehicleId: string;
    }): Promise<Assignment> => {
        const { data } = await api.post<ApiResponse<Assignment>>(
            '/api/v1/assignments',
            assignmentData
        );
        return data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/v1/assignments/${id}`);
    },
};

export default api;
