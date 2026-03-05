import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('auth_token') || null,
    user: null, // Ideally, initialization of user should happen via a token verify API call on app mount
    isAuthenticated: !!localStorage.getItem('auth_token'),
    setAuth: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ token, user, isAuthenticated: true });
    },
    clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null, isAuthenticated: false });
    },
}));
