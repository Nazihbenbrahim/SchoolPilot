import React from 'react';

const EnsitLogoUnesco = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* UNESCO Logo */}
      <g transform="translate(50, 30)">
        <path d="M50 0H100V60H50V0Z" fill="#333333" />
        <rect x="60" y="10" width="30" height="5" fill="#FFFFFF" />
        <rect x="60" y="20" width="30" height="5" fill="#FFFFFF" />
        <rect x="60" y="30" width="30" height="5" fill="#FFFFFF" />
        <rect x="60" y="40" width="30" height="5" fill="#FFFFFF" />
        <rect x="60" y="50" width="30" height="5" fill="#FFFFFF" />
      </g>
      
      {/* UNEVOC Text */}
      <text x="160" y="50" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#333333">UNEVOC</text>
      <line x1="160" y1="60" x2="240" y2="60" stroke="#333333" strokeWidth="1" />
      
      {/* Small UNESCO Text */}
      <text x="160" y="75" fontFamily="Arial" fontSize="8" fill="#333333">International Centre for</text>
      <text x="160" y="85" fontFamily="Arial" fontSize="8" fill="#333333">Technical and Vocational</text>
      <text x="160" y="95" fontFamily="Arial" fontSize="8" fill="#333333">Education and Training</text>
      
      {/* ENSIT Logo */}
      <g transform="translate(100, 120)">
        {/* Courbes colorées */}
        <path d="M20 30C25 10 35 0 50 10C65 20 80 40 90 50C100 60 105 70 100 80C95 90 85 95 70 90C55 85 40 70 30 60C20 50 15 50 20 30Z" fill="#3A5CAA" fillOpacity="0.8" />
        <path d="M30 20C40 5 55 -5 70 0C85 5 100 20 110 35C120 50 120 65 110 75C100 85 85 90 70 85C55 80 40 65 30 50C20 35 20 35 30 20Z" fill="#6AAFE5" fillOpacity="0.6" />
        <path d="M40 60C50 75 65 85 80 80C95 75 110 60 120 45C130 30 130 15 120 5C110 -5 95 -10 80 -5C65 0 50 15 40 30C30 45 30 45 40 60Z" fill="#8CB23E" fillOpacity="0.7" />
        <path d="M50 70C60 80 75 85 90 80C105 75 120 60 130 45C140 30 140 15 130 5C120 -5 105 -10 90 -5C75 0 60 15 50 30C40 45 40 60 50 70Z" fill="#F8CC29" fillOpacity="0.7" />
        <path d="M60 20C70 5 90 -5 105 0C120 5 135 20 145 35C155 50 155 65 145 75C135 85 120 90 105 85C90 80 75 65 65 50C55 35 50 35 60 20Z" fill="#E08E3C" fillOpacity="0.7" />
        
        {/* Logo ENSIT */}
        <path d="M55 25L55 65L125 65L125 25L55 25Z" fill="#E32726" />
        <path d="M65 35L115 35L115 40L65 40L65 35Z" fill="white" />
        <path d="M65 45L115 45L115 50L65 50L65 45Z" fill="white" />
        <path d="M65 55L115 55L115 60L65 60L65 55Z" fill="white" />
      </g>
    </svg>
  );
};

export default EnsitLogoUnesco;
