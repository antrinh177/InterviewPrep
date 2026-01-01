import React from "react";

export default function CircularProgress({
  percentage,
  size = 120,
  stroke = 10,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* default circle */}
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* circle for users' progress */}
        <circle
          stroke="#4caf50"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />

        {/* display % in the middle of the circle */}
        <text
          x="50%"
          y="50%"
          dy="0.3em"
          textAnchor="middle"
          fontSize={size * 0.2}
          fill="#333"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
}
