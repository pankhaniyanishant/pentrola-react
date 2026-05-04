import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, getApiErrorMessage } from '../services/api';

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    isAdmin: boolean;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
    updateProfile: (payload: { name: string; email: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser) as Partial<User>;
                if (parsed.uid && parsed.email) {
                    setUser({
                        uid: parsed.uid,
                        email: parsed.email,
                        displayName: parsed.displayName || null,
                        token: parsed.token,
                        isAdmin: !!parsed.isAdmin,
                    });
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const saveUser = (nextUser: User) => {
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
    };

    const normalizeUser = (data: {
        uid: string;
        email: string;
        name: string;
        token?: string;
        isAdmin?: boolean;
    }): User => ({
        uid: data.uid,
        email: data.email,
        displayName: data.name,
        token: data.token,
        isAdmin: !!data.isAdmin,
    });

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            const authUser = normalizeUser(data);
            saveUser(authUser);
            return authUser;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Login failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const register = async (fullName: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name: fullName, email, password });
            saveUser(normalizeUser(data));
        } catch (error) {
            throw new Error(getApiErrorMessage(error, 'Registration failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async ({ name, email, password }: { name: string; email: string; password?: string }) => {
        const payload = password ? { name, email, password } : { name, email };
        const { data } = await api.put('/auth/profile', payload);
        saveUser(normalizeUser(data));
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isAdmin: !!user?.isAdmin,
            isLoading,
            login,
            logout,
            register,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
