import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(undefined);

const STORAGE_KEY = 'auraxam_user';

const starterBadges = [
  {
    id: 'starter',
    name: 'First Steps',
    description: 'Joined AuraXam',
    icon: 'Award',
    earnedDate: new Date().toISOString(),
    rarity: 'common'
  }
];

const readStoredUser = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user) => {
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors and continue with in-memory state.
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (!email || !password || password.length < 6) {
        return false;
      }

      const existingUser = readStoredUser();
      const loggedInUser = existingUser ?? {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0] || 'AuraXam User',
        avatar: '',
        joinDate: new Date().toISOString(),
        streak: 1,
        totalXP: 120,
        badges: starterBadges
      };

      setUser(loggedInUser);
      writeStoredUser(loggedInUser);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (!name || !email || !password || password.length < 6) {
        return false;
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        avatar: '',
        joinDate: new Date().toISOString(),
        streak: 1,
        totalXP: 0,
        badges: starterBadges
      };

      setUser(newUser);
      writeStoredUser(newUser);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    writeStoredUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
