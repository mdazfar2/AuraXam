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
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 HANDLE GOOGLE REDIRECT DATA (MAIN FIX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");

    // ✅ If coming from Google login
    if (name && email) {
      const loggedInUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        avatar: picture,
        joinDate: new Date().toISOString(),
        streak: 1,
        totalXP: 120,
        badges: starterBadges
      };

      setUser(loggedInUser);
      writeStoredUser(loggedInUser);

      // ✅ Clean URL (IMPORTANT)
      window.history.replaceState({}, document.title, "/");
    }

    setIsLoading(false);
  }, []);

  // ✅ GOOGLE LOGIN
  const login = async () => {
    window.location.href = "http://localhost:8000/auth/login";
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
