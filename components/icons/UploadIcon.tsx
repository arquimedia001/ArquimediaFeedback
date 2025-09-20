
import React from 'react';

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className || "h-10 w-10"} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-3-3-3 3" />
  </svg>
);

export default UploadIcon;
