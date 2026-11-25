'use client';

import React, { useEffect, useState, useRef } from 'react';

interface RollingCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function RollingCounter({
  value,
  prefix = '',
  suffix = '',
  className = '',
}: RollingCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      prevValueRef.current = end;
      setDisplayValue(end);
      return;
    }

    const duration = 420;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = end;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      prevValueRef.current = end;
    };
  }, [value]);

  return (
    <span
      className={`font-mono tabular-nums inline-flex items-baseline font-bold tracking-tight ${className}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}
      <span>{displayValue}</span>
      {suffix}
    </span>
  );
}
