// User types
export interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: 'ADMIN' | 'OPERATIONS';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Driver types
export type DriverStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface Driver {
    id: string;
    fullName: string;
    phoneNumber: string;
    licenseNumber: string;
    status: DriverStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

// Vehicle types
export interface Vehicle {
    id: string;
    registrationNumber: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

// Assignment types
export interface Assignment {
    id: string;
    driverId: string;
    vehicleId: string;
    assignedAt: string;
    unassignedAt?: string;
    driver?: Driver;
    vehicle?: Vehicle;
}

// API Response types
export interface ApiResponse<T = any> {
    message: string;
    data?: T;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    role?: 'ADMIN' | 'OPERATIONS';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Pagination types
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface QueryDriversParams extends PaginationParams {
    status?: DriverStatus;
}

export interface QueryAssignmentsParams extends PaginationParams {
    driverId?: string;
    vehicleId?: string;
    activeOnly?: boolean;
}
