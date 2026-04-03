import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if nothing is found
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store the current value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return initialValue if none exists
      const parsedItem = item ? JSON.parse(item) : initialValue;
      console.log(`[Storage] Loaded ${key}:`, parsedItem);
      
      return parsedItem;
    } catch (error) {
      console.error(`[Storage] Error loading ${key}:`, error);
      return initialValue;
    }
  });

  // Update both state and localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function for functional updates (like setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      console.log(`[Storage] Saved ${key}:`, valueToStore);
    } catch (error) {
      console.error(`[Storage] Error saving ${key}:`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      console.log(`[Storage] Removed ${key}`);
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error);
    }
  };

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== key) return;

      if (e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
          console.log(`[Storage] Sync ${key}:`, newValue);
        } catch (error) {
          console.error(`[Storage] Sync error ${key}:`, error);
        }
      } else {
        // Item was removed from another tab
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook specifically for AuraXam data persistence
 */
export const useExamStorage = () => {
  const [examAttempts, setExamAttempts, removeExamAttempts] = useLocalStorage('auraxam_exam_attempts', []);
  const [examHistory, setExamHistory, removeExamHistory] = useLocalStorage('auraxam_exam_history', []);
  const [userProgress, setUserProgress, removeUserProgress] = useLocalStorage('auraxam_user_progress', {});

  // Save exam attempt
  const saveExamAttempt = (attempt) => {
    setExamAttempts((prev) => [...prev, attempt]);
  };

  // Update specific attempt (e.g., during an active session)
  const updateExamAttempt = (attemptId, updates) => {
    setExamAttempts((prev) => 
      prev.map(attempt => 
        attempt.id === attemptId ? { ...attempt, ...updates } : attempt
      )
    );
  };

  // Get specific attempt by ID
  const getExamAttempt = (attemptId) => {
    return examAttempts.find((attempt) => attempt.id === attemptId);
  };

  // Add to history (capped at 50 for performance)
  const addToHistory = (examData) => {
    setExamHistory((prev) => [examData, ...prev].slice(0, 50));
  };

  // Update user progress (levels, XP, etc.)
  const updateProgress = (progressData) => {
    setUserProgress((prev) => ({ ...prev, ...progressData }));
  };

  // Clear everything (Reset Profile)
  const clearAllData = () => {
    removeExamAttempts();
    removeExamHistory();
    removeUserProgress();
    console.log('[Storage] Global Clear Performed');
  };

  return {
    examAttempts,
    examHistory,
    userProgress,
    saveExamAttempt,
    updateExamAttempt,
    getExamAttempt,
    addToHistory,
    updateProgress,
    clearAllData
  };
};