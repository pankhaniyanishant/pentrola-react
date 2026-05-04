import { api } from './api';

export interface AdminProduct {
    _id: string;
    title: string;
    category?: string;
    price: number;
    description: string;
    image?: string;
    stock: number;
}

export interface AdminOrderItem {
    title: string;
    qty: number;
    price: number;
}

export interface AdminOrder {
    _id: string;
    status: string;
    user?: string;
    userEmail?: string;
    guestEmail?: string;
    customerName?: string;
    customerEmail?: string;
    totalPrice: number;
    createdAt: string;
    shippingAddress?: {
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    };
    orderItems: AdminOrderItem[];
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
}

export const getAdminProducts = async () => {
    const { data } = await api.get<AdminProduct[]>('/products');
    return data;
};

export const createAdminProduct = async (payload: Partial<AdminProduct>) => {
    const { data } = await api.post<AdminProduct>('/products', payload);
    return data;
};

export const updateAdminProduct = async (id: string, payload: Partial<AdminProduct>) => {
    const { data } = await api.put<AdminProduct>(`/products/${id}`, payload);
    return data;
};

export const deleteAdminProduct = async (id: string) => {
    await api.delete(`/products/${id}`);
};

export const getAdminOrders = async () => {
    const { data } = await api.get<AdminOrder[]>('/orders');
    return data;
};

export const updateAdminOrderStatus = async (id: string, status: string) => {
    const { data } = await api.put<AdminOrder>(`/orders/${id}/status`, { status });
    return data;
};

export const getAdminUsers = async () => {
    const { data } = await api.get<AdminUser[]>('/auth/users');
    return data;
};

export const createAdminUser = async (payload: {
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
}) => {
    const { data } = await api.post<AdminUser>('/auth/users', payload);
    return data;
};

export const updateAdminUser = async (
    id: string,
    payload: {
        name?: string;
        email?: string;
        password?: string;
        isAdmin?: boolean;
    }
) => {
    const { data } = await api.put<AdminUser>(`/auth/users/${id}`, payload);
    return data;
};

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    revenueGrowth: number;
    salesGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    recentOrders: {
        _id: string;
        status: string;
        totalPrice: number;
        createdAt: string;
        user?: string;
        guestEmail?: string;
        customerName?: string;
        customerEmail?: string;
    }[];
    recentActivity: {
        id: string;
        type: string;
        message: string;
        time: string;
        status: string;
    }[];
}

export const getDashboardStats = async (timeRange: string = 'Today') => {
    const { data } = await api.get<DashboardStats>(`/admin/dashboard/stats?range=${timeRange}`);
    return data;
};

export interface ReportData {
    range: string;
    generatedAt: string;
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    orders: {
        orderId: string;
        customerName: string;
        customerEmail: string;
        items: number;
        total: number;
        status: string;
        date: string;
    }[];
}

export const generateReport = async (timeRange: string = 'Today') => {
    const { data } = await api.get<ReportData>(`/admin/dashboard/report?range=${timeRange}`);
    return data;
};

export interface AnalyticsData {
    grossSales: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    salesGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    aovGrowth: number;
    salesChart: { month: string; sales: number }[];
    topProducts: { name: string; sales: number; growth: number }[];
}

export const getAnalytics = async (timeRange: string = '7d') => {
    const { data } = await api.get<AnalyticsData>(`/admin/analytics?range=${timeRange}`);
    return data;
};

export const deleteAdminUser = async (id: string) => {
    await api.delete(`/auth/users/${id}`);
};

export interface ProductCategory {
    _id: string;
    count: number;
}

export interface Product {
    _id: string;
    title: string;
    price: number;
    image?: string;
    category?: string;
    stock: number;
    isBestseller?: boolean;
    createdAt?: string;
}

export const getCategories = async () => {
    const { data } = await api.get<ProductCategory[]>('/products/categories');
    return data;
};

export const getBestsellers = async () => {
    const { data } = await api.get<Product[]>('/products/bestsellers');
    return data;
};

export const getProducts = async (limit: number = 4) => {
    const { data } = await api.get<Product[]>(`/products/all?limit=${limit}`);
    return data;
};

export const getNewArrivals = async () => {
    const { data } = await api.get<Product[]>('/products/newarrivals');
    return data;
};
