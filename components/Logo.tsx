
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", size = 60 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
      >
        <defs>
          <linearGradient id="mamboroNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="50%" stopColor="#7000ff" />
            <stop offset="100%" stopColor="#bc00ff" />
          </linearGradient>
          
          <filter id="mamboroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Network Lines forming the 'M' */}
        <g stroke="url(#mamboroNeonGrad)" strokeWidth="1.2" filter="url(#mamboroGlow)" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
          {/* Left Pillar */}
          <path d="M15 15 L15 85 M15 15 L35 25 L35 85 L15 85 Z" />
          <path d="M15 15 L35 45 M15 35 L35 25 M15 35 L35 65 M15 60 L35 45 M15 60 L35 85 M15 85 L35 65" />
          
          {/* Middle V Section */}
          <path d="M35 25 L50 60 L65 25" />
          <path d="M35 45 L50 60 M35 65 L50 85 M50 85 L65 65 M50 60 L65 45" />
          <path d="M35 85 L50 85 L65 85" />
          
          {/* Right Pillar */}
          <path d="M65 25 L85 15 L85 85 L65 85 Z" />
          <path d="M85 85 L65 65 M85 60 L65 85 M85 60 L65 45 M85 35 L65 65 M85 35 L65 25 M85 15 L65 45" />
          <path d="M85 15 L85 85" />
        </g>

        {/* Nodes (Glowing Points) */}
        <g fill="white" filter="url(#nodeGlow)">
          {/* Left Column */}
          <circle cx="15" cy="15" r="2.5" fill="#00f2ff" />
          <circle cx="15" cy="35" r="2.5" fill="#00f2ff" />
          <circle cx="15" cy="60" r="2.5" fill="#00f2ff" />
          <circle cx="15" cy="85" r="2.5" fill="#00f2ff" />

          {/* Inner Left Column */}
          <circle cx="35" cy="25" r="2.5" fill="#3b82f6" />
          <circle cx="35" cy="45" r="2.5" fill="#3b82f6" />
          <circle cx="35" cy="65" r="2.5" fill="#3b82f6" />
          <circle cx="35" cy="85" r="2.5" fill="#3b82f6" />

          {/* Center Column */}
          <circle cx="50" cy="60" r="3" fill="#7000ff" />
          <circle cx="50" cy="85" r="3" fill="#7000ff" />

          {/* Inner Right Column */}
          <circle cx="65" cy="25" r="2.5" fill="#8b5cf6" />
          <circle cx="65" cy="45" r="2.5" fill="#8b5cf6" />
          <circle cx="65" cy="65" r="2.5" fill="#8b5cf6" />
          <circle cx="65" cy="85" r="2.5" fill="#8b5cf6" />

          {/* Right Column */}
          <circle cx="85" cy="15" r="2.5" fill="#bc00ff" />
          <circle cx="85" cy="35" r="2.5" fill="#bc00ff" />
          <circle cx="85" cy="60" r="2.5" fill="#bc00ff" />
          <circle cx="85" cy="85" r="2.5" fill="#bc00ff" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
