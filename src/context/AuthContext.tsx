import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (fullName: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                const mockUser = { uid: data.uid, email: data.email, displayName: data.name };
                setUser(mockUser);
                localStorage.setItem('user', JSON.stringify(mockUser));
            } else {
                throw new Error(data.message || 'Login failed');
            }
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
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fullName, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                const mockUser = { uid: data.uid, email: data.email, displayName: data.name };
                setUser(mockUser);
                localStorage.setItem('user', JSON.stringify(mockUser));
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoading,
            login,
            logout,
            register
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
