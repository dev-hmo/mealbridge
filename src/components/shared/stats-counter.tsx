"use client";

import { useEffect, useState, useRef } from "react";

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  color?: string;
  duration?: number;
}

export function StatsCounter({
  value,
  label,
  suffix = "",
  color = "text-green-600",
  duration = 2000,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  const animateCount = () => {
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
  };

  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl md:text-5xl font-bold ${color}`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  );
}
