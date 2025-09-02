import React from "react";
import altamediaLogo from "../assets/altamedia_logo.jpg";

export default function AltamediaLogo({ className = "", size = "default" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-12 h-12",
    xlarge: "w-16 h-16",
    xxlarge: "w-20 h-20"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src={altamediaLogo}
        alt="AltaMedia Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          console.error('Failed to load logo image:', e.target.src);
        }}
      />
    </div>
  );
} 