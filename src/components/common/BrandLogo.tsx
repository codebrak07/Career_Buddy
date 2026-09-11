import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = 'w-8 h-8', 
  size 
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      fill="none"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="Career Buddy Logo"
    >
      <title>Career Buddy</title>
      <desc>Minimal geometric upward career trajectory icon.</desc>
      <g stroke="#171A1F" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round">
        <path d="M86 418V340" />
        <path d="M180 418V286" />
      </g>
      <path 
        d="M274 418V228C274 218 280 208 288 201L372 130C383 121 398 129 398 143V418C398 429 389 438 378 438H294C283 438 274 429 274 418Z" 
        fill="#FF5A1F" 
      />
      <path 
        d="M58 396C58 382 69 371 83 371C97 371 108 382 108 396C108 410 97 421 83 421C69 421 58 410 58 396Z" 
        fill="#171A1F" 
      />
      <path 
        d="M91 343C91 303 118 283 157 279C191 276 214 258 214 223C214 183 245 156 291 151L357 143" 
        stroke="#171A1F" 
        strokeWidth="34" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M356 93C356 72 373 55 394 55C415 55 432 72 432 93C432 114 415 131 394 131C373 131 356 114 356 93Z" 
        fill="#FF5A1F" 
      />
    </svg>
  );
};
