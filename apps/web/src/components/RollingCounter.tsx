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
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Respect reduced motion: immediately set final value
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const start = displayValue;
    const end = value;
    const duration = 900; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: cubic-bezier(0.16, 1, 0.3, 1) easeOutExpo approximation
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  const targetValue = mounted ? displayValue : value;

  return (
    <span
      className={`font-mono tabular-nums inline-flex items-baseline font-bold tracking-tight ${className}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}
      <span>{targetValue}</span>
      {suffix}
    </span>
  );
}
