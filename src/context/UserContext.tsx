import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, type User } from '../db';

interface UserContextType {
    currentUser: User | null;
    login: (name: string, password?: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, password?: string) => Promise<boolean>;
    updatePassword: (newPassword: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedId = localStorage.getItem('taco_user_id');
        return savedId ? { id: Number(savedId), name: '' } as User : null;
    });

    // Hydrate user details if ID is saved
    useEffect(() => {
        if (currentUser?.id && !currentUser.name) {
            db.users.get(currentUser.id).then(user => {
                if (user) setCurrentUser(user);
                else logout();
            });
        }
    }, [currentUser?.id]);

    const login = async (name: string, password?: string) => {
        const user = await db.users.where('name').equals(name).first();

        if (user) {
            // Simple password check (plain text for MVP)
            if (user.password === password || (!user.password && !password)) {
                setCurrentUser(user);
                localStorage.setItem('taco_user_id', String(user.id));
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('taco_user_id');
    };

    const register = async (name: string, password?: string) => {
        try {
            const existing = await db.users.where('name').equals(name).first();
            if (existing) return false;

            const id = await db.users.add({ name, password });
            const newUser = await db.users.get(id);
            if (newUser) {
                setCurrentUser(newUser);
                localStorage.setItem('taco_user_id', String(newUser.id));
                return true;
            }
        } catch (error) {
            console.error('Failed to register:', error);
        }
        return false;
    };

    const updatePassword = async (newPassword: string) => {
        if (!currentUser) return false;
        try {
            await db.users.update(currentUser.id, { password: newPassword });
            setCurrentUser({ ...currentUser, password: newPassword });
            return true;
        } catch (error) {
            console.error('Failed to update password:', error);
            return false;
        }
    };

    return (
        <UserContext.Provider value={{ currentUser, login, logout, register, updatePassword }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
