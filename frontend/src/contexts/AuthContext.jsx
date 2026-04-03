import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

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
  } catch {}
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 HANDLE GOOGLE TOKEN
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const newUser = {
        id: `google_${Date.now()}`,
        email: "google_user",
        name: "Google User",
        avatar: '',
        joinDate: new Date().toISOString(),
        streak: 1,
        totalXP: 0,
        badges: starterBadges,
        token
      };

      setUser(newUser);
      writeStoredUser(newUser);

      // साफ URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const login = async () => {
    return false; // disabled (Google OAuth used)
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
