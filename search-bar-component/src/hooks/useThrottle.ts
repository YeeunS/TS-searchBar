import { useRef, useEffect } from "react";

const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
  const lastCallRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledFunction = (...args: any[]) => {
    const now = Date.now();
    if (lastCallRef.current === null || now - lastCallRef.current >= delay) {
      callback(...args);
      lastCallRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledFunction;
};

export default useThrottle;
