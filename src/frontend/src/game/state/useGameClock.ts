import { useState, useEffect } from 'react';

export function useGameClock() {
  const [timeOfDay, setTimeOfDay] = useState(8); // Start at 8 AM

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay((prev) => (prev + 0.1) % 24);
    }, 1000); // Advance time every second

    return () => clearInterval(interval);
  }, []);

  return { timeOfDay };
}
