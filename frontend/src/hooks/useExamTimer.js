import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing exam timer functionality
 * @param {number} initialTimeInMinutes - Duration of the exam
 */
export const useExamTimer = (initialTimeInMinutes) => {
  // Time remaining in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTimeInMinutes * 60);
  
  // UI and Lifecycle states
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Start the timer
  const startTimer = useCallback(() => {
    setIsRunning(true);
    console.log('Exam timer started');
  }, []);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    console.log('Exam timer paused');
  }, []);

  // Reset the timer to initial value
  const resetTimer = useCallback(() => {
    setTimeRemaining(initialTimeInMinutes * 60);
    setIsRunning(false);
    setIsFinished(false);
    console.log('Exam timer reset');
  }, [initialTimeInMinutes]);

  // Add time to the timer (useful for accommodations)
  const addTime = useCallback((minutesToAdd) => {
    setTimeRemaining(prev => prev + (minutesToAdd * 60));
    console.log(`Added ${minutesToAdd} minutes to exam timer`);
  }, []);

  // Effect to handle the countdown logic
  useEffect(() => {
    let intervalId;

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Warning logs (5m and 1m remaining)
          if (newTime === 300) console.warn('5 minutes remaining!');
          if (newTime === 60) console.warn('1 minute remaining!');
          
          return newTime;
        });
      }, 1000);
    }

    // Cleanup interval on unmount or when timer stops
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeRemaining]);

  // Effect to handle auto-submission when time hits zero
  useEffect(() => {
    if (timeRemaining <= 0 && !isFinished) {
      setIsRunning(false);
      setIsFinished(true);
      console.log('Exam timer finished - auto-submitting');
    }
  }, [timeRemaining, isFinished]);

  // Helper: Format time as HH:MM:SS or MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    } else {
      return `${pad(minutes)}:${pad(remainingSeconds)}`;
    }
  }, []);

  // Derived states for UI logic
  const formattedTime = formatTime(timeRemaining);
  const totalSeconds = initialTimeInMinutes * 60;
  
  // Calculate progress percentage for visual progress bars
  const progressPercentage = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  // Warning states (10% and 5% thresholds)
  const isWarning = timeRemaining < (totalSeconds * 0.1);
  const isCritical = timeRemaining < (totalSeconds * 0.05);

  return {
    timeRemaining,
    formattedTime,
    isRunning,
    isFinished,
    isWarning,
    isCritical,
    progressPercentage,
    startTimer,
    pauseTimer,
    resetTimer,
    addTime,
    formatTime
  };
};