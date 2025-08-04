import React from "react";

export default function AltamediaLogo({ className = "", size = "default" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8", 
    large: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Yellow wave element */}
        <path
          d="M10 15 Q20 5, 30 15 Q40 25, 50 15 Q60 5, 70 15 Q80 25, 90 15"
          stroke="#f59e0b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Dark gray element in first valley */}
        <ellipse
          cx="30"
          cy="18"
          rx="2"
          ry="1.5"
          fill="#6b7280"
        />
        
        {/* Text "AltaMedia" */}
        <text
          x="50"
          y="35"
          textAnchor="middle"
          fill="currentColor"
          fontSize="12"
          fontFamily="cursive, serif"
          fontStyle="italic"
          fontWeight="normal"
        >
          AltaMedia
        </text>
      </svg>
    </div>
  );
} 