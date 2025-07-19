import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerProps } from '../types';
import './Timer.css';

const Timer: React.FC<TimerProps> = ({ initialSeconds, direction, running, onComplete }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<number | null>(null);
  
  // Format seconds as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Timer logic
  const tick = useCallback(() => {
    setSeconds(prev => {
      if (direction === 'down' && prev <= 1) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (onComplete) {
          onComplete();
        }
        return 0;
      }
      return direction === 'up' ? prev + 1 : prev - 1;
    });
  }, [direction, onComplete]);

  // Start/stop timer when running status changes
  useEffect(() => {
    if (running) {
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
  }, [running, tick]);

  // Reset timer when initialSeconds changes
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return (
    <div className="timer">
      <div className="timer-display">{formatTime(seconds)}</div>
    </div>
  );
};

export default Timer;
