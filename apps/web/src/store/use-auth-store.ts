import type { Session, User } from 'better-auth';
import { create } from 'zustand';

interface AuthState {
	user: User | null;
	session: Session | null;
	jwt: string | null;
	isLoading: boolean;
	setAuth: (
		user: User | null,
		session: Session | null,
		jwt?: string | null,
	) => void;
	clearAuth: () => void;
	setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	session: null,
	jwt: null,
	isLoading: true, // Start loading as true until app init finishes
	setAuth: (user, session, jwt) =>
		set({ user, session, jwt: jwt || null, isLoading: false }),
	clearAuth: () =>
		set({ user: null, session: null, jwt: null, isLoading: false }),
	setLoading: (isLoading) => set({ isLoading }),
}));
