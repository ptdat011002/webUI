import { useEffect, useState } from 'react';
/**
 *
 * @param timer > 0
 * @param options
 * @returns
 */
export const useCountdown = (
  timer: number,
  options?: {
    onEnd?: () => void;
    /** seconds */
    step?: number;
  },
) => {
  const [time, setTime] = useState(timer);

  const step = options?.step || 1;

  useEffect(() => {
    if (time < 0) return;
    if (time > 0) {
      const interval = setInterval(() => {
        setTime((t) => t - step);
      }, step * 1000);
      return () => clearInterval(interval);
    } else {
      options?.onEnd?.();
    }
  }, [options, time]);

  return [time, setTime] as const;
};
