"use client";

import React, { useMemo } from "react";

interface FocusRingProps {
  hours: number;
  goalHours: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  className?: string;
}

export default function FocusRing({
  hours,
  goalHours,
  size = 120,
  strokeWidth = 6,
  animated = true,
  className = "",
}: FocusRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(hours / goalHours, 1);
  const strokeDashoffset = circumference * (1 - progress);

  // Determine color based on progress
  const getColor = () => {
    if (progress >= 1) return "var(--color-emerald)";
    if (progress >= 0.75) return "var(--color-indigo)";
    if (progress >= 0.5) return "var(--color-rose)";
    return "var(--color-slate-400)";
  };

  const color = getColor();

  return (
    <div
      className={`focus-ring-container ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: "rotate(-90deg)",
          filter: "drop-shadow(var(--shadow-sm))",
        }}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-slate-200)"
          strokeWidth={strokeWidth}
          opacity="0.3"
        />

        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: animated ? "stroke-dashoffset 0.6s ease-in-out, stroke 0.3s ease-in-out" : "none",
          }}
        />
      </svg>

      {/* Center stats */}
      <div
        style={{
          textAlign: "center",
          position: "absolute",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-family-mono)",
          }}
        >
          {hours.toFixed(1)}h
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            fontWeight: "var(--font-weight-medium)",
            letterSpacing: "0.05em",
          }}
        >
          of {goalHours}h
        </div>
      </div>
    </div>
  );
}
