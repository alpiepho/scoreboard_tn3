import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialSeconds: number;
  direction: 'up' | 'down';
  autoStart?: boolean;
}

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  isComplete: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void;
  formattedTime: string;
}

const useTimer = ({ initialSeconds, direction, autoStart = false }: UseTimerProps): UseTimerReturn => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Format seconds as MM:SS
  const formatTime = useCallback((totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Timer logic
  const tick = useCallback(() => {
    setSeconds(prev => {
      if (direction === 'down' && prev <= 1) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
        setIsComplete(true);
        return 0;
      }
      return direction === 'up' ? prev + 1 : prev - 1;
    });
  }, [direction]);

  // Start timer
  const start = useCallback(() => {
    if (!isRunning && !intervalRef.current) {
      setIsRunning(true);
      setIsComplete(false);
    }
  }, [isRunning]);

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  // Toggle timer
  const toggle = useCallback(() => {
    if (isComplete) {
      reset();
      start();
    } else if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, isComplete, start, pause, reset]);

  // Start/stop timer when running status changes
  useEffect(() => {
    if (isRunning) {
      // Start timer
      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(tick, 1000);
      }
    } else {
      // Stop timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // Reset timer when initialSeconds changes
  useEffect(() => {
    reset();
  }, [initialSeconds, reset]);

  return {
    seconds,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    toggle,
    formattedTime: formatTime(seconds),
  };
};

export default useTimer;
