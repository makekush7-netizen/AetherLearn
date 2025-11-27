import React from "react";

interface AetherLearnLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 48, height: 48, fontSize: 14 },
  md: { width: 64, height: 64, fontSize: 18 },
  lg: { width: 128, height: 128, fontSize: 32 },
  xl: { width: 256, height: 256, fontSize: 48 },
};

const AetherLearnLogo: React.FC<AetherLearnLogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const dimensions = sizeMap[size];
  const iconSize = dimensions.width;
  const scale = iconSize / 128; // Base size is 128

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient
            id="gradientGlow"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient
            id="gradientText"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow circle */}
        <circle
          cx="64"
          cy="64"
          r="62"
          fill="none"
          stroke="url(#gradientGlow)"
          strokeWidth="0.5"
          opacity="0.3"
          filter="url(#glowStrong)"
        />

        {/* Letter A - Main shape */}
        <g filter="url(#glow)">
          {/* Left stroke of A */}
          <path
            d="M 40 110 L 64 30 L 88 110"
            fill="none"
            stroke="url(#gradientGlow)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal bar of A */}
          <line
            x1="48"
            y1="75"
            x2="80"
            y2="75"
            stroke="url(#gradientGlow)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        {/* Orbital ring - Top */}
        <circle
          cx="64"
          cy="64"
          r="48"
          fill="none"
          stroke="url(#gradientGlow)"
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray="150 150"
          filter="url(#glow)"
        />

        {/* Orbital ring - Rotated */}
        <g opacity="0.4" filter="url(#glow)">
          <circle
            cx="64"
            cy="64"
            r="48"
            fill="none"
            stroke="url(#gradientGlow)"
            strokeWidth="2"
            transform="rotate(45 64 64)"
            strokeDasharray="150 150"
          />
        </g>

        {/* Orbital ring - Another rotation */}
        <g opacity="0.3" filter="url(#glow)">
          <circle
            cx="64"
            cy="64"
            r="48"
            fill="none"
            stroke="url(#gradientGlow)"
            strokeWidth="2"
            transform="rotate(90 64 64)"
            strokeDasharray="150 150"
          />
        </g>

        {/* Glowing particles around the orbit */}
        <circle cx="112" cy="64" r="2.5" fill="url(#gradientGlow)" filter="url(#glowStrong)" />
        <circle cx="16" cy="64" r="2.5" fill="url(#gradientGlow)" filter="url(#glowStrong)" />
        <circle cx="64" cy="112" r="2.5" fill="url(#gradientGlow)" filter="url(#glowStrong)" />
        <circle cx="64" cy="16" r="2.5" fill="url(#gradientGlow)" filter="url(#glowStrong)" />

        {/* Additional decorative particles */}
        <circle cx="95" cy="95" r="1.5" fill="url(#gradientGlow)" opacity="0.7" />
        <circle cx="33" cy="33" r="1.5" fill="url(#gradientGlow)" opacity="0.7" />
        <circle cx="95" cy="33" r="1.5" fill="url(#gradientGlow)" opacity="0.7" />
        <circle cx="33" cy="95" r="1.5" fill="url(#gradientGlow)" opacity="0.7" />
      </svg>

      {/* Text Logo */}
      {showText && (
        <div className="mt-4 text-center">
          <svg
            width={Math.max(iconSize * 2, 200)}
            height={dimensions.fontSize * 1.5}
            viewBox="0 0 240 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="textGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            <text
              x="120"
              y="48"
              textAnchor="middle"
              fontSize="42"
              fontWeight="700"
              fontFamily="'Segoe UI', 'Helvetica', 'Arial', sans-serif"
              fill="url(#textGradient)"
              letterSpacing="-1"
            >
              AetherLearn
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default AetherLearnLogo;
