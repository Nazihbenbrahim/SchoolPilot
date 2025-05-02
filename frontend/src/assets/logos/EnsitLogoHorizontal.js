import React from 'react';

const EnsitLogoHorizontal = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Courbes colorées */}
        <path d="M30 50C35 30 45 20 60 30C75 40 90 60 100 70C110 80 115 90 110 100C105 110 95 115 80 110C65 105 50 90 40 80C30 70 25 70 30 50Z" fill="#3A5CAA" fillOpacity="0.8" />
        <path d="M40 40C50 25 65 15 80 20C95 25 110 40 120 55C130 70 130 85 120 95C110 105 95 110 80 105C65 100 50 85 40 70C30 55 30 55 40 40Z" fill="#6AAFE5" fillOpacity="0.6" />
        <path d="M50 80C60 95 75 105 90 100C105 95 120 80 130 65C140 50 140 35 130 25C120 15 105 10 90 15C75 20 60 35 50 50C40 65 40 65 50 80Z" fill="#8CB23E" fillOpacity="0.7" />
        <path d="M60 90C70 100 85 105 100 100C115 95 130 80 140 65C150 50 150 35 140 25C130 15 115 10 100 15C85 20 70 35 60 50C50 65 50 80 60 90Z" fill="#F8CC29" fillOpacity="0.7" />
        <path d="M70 40C80 25 100 15 115 20C130 25 145 40 155 55C165 70 165 85 155 95C145 105 130 110 115 105C100 100 85 85 75 70C65 55 60 55 70 40Z" fill="#E08E3C" fillOpacity="0.7" />
        
        {/* Logo ENSIT */}
        <path d="M65 45L65 85L135 85L135 45L65 45Z" fill="#E32726" />
        <path d="M75 55L125 55L125 60L75 60L75 55Z" fill="white" />
        <path d="M75 65L125 65L125 70L75 70L75 65Z" fill="white" />
        <path d="M75 75L125 75L125 80L75 80L75 75Z" fill="white" />
        
        {/* Texte "Ecole Nationale Supérieure d'Ingénieurs de Tunis" */}
        <text x="175" y="40" fontFamily="Arial" fontSize="14" fontWeight="500" fill="#333" textAnchor="start">
          Ecole Nationale
        </text>
        <text x="175" y="60" fontFamily="Arial" fontSize="14" fontWeight="500" fill="#333" textAnchor="start">
          Supérieure
        </text>
        <text x="175" y="80" fontFamily="Arial" fontSize="14" fontWeight="500" fill="#333" textAnchor="start">
          d'Ingénieurs
        </text>
        <text x="175" y="100" fontFamily="Arial" fontSize="14" fontWeight="500" fill="#333" textAnchor="start">
          de Tunis
        </text>
      </g>
    </svg>
  );
};

export default EnsitLogoHorizontal;
