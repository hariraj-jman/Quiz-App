import React from "react";

const SvgBackground = () => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#007bff", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#0055cc", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)" />
        <circle cx="30%" cy="30%" r="150" fill="rgba(255, 255, 255, 0.2)" />
        <circle cx="70%" cy="70%" r="200" fill="rgba(255, 255, 255, 0.1)" />
        <circle cx="50%" cy="50%" r="100" fill="rgba(255, 255, 255, 0.3)" />
      </svg>
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Your login form or content here */}
      </div>
    </div>
  );
};

export default SvgBackground;
