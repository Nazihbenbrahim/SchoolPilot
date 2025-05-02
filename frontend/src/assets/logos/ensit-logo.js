import React from 'react';

const EnsitLogo = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Courbes colorées */}
        <path d="M80 140C90 100 120 80 160 100C200 120 240 160 260 180C280 200 290 220 280 240C270 260 240 270 200 260C160 250 120 220 100 200C80 180 70 180 80 140Z" fill="#3A5CAA" fillOpacity="0.8" />
        <path d="M100 120C120 90 150 70 190 80C230 90 270 120 290 150C310 180 310 210 290 230C270 250 230 260 190 250C150 240 110 210 90 180C70 150 80 150 100 120Z" fill="#6AAFE5" fillOpacity="0.6" />
        <path d="M120 220C140 250 180 270 220 260C260 250 300 220 320 190C340 160 340 130 320 110C300 90 260 80 220 90C180 100 140 130 120 160C100 190 100 190 120 220Z" fill="#8CB23E" fillOpacity="0.7" />
        <path d="M140 240C160 260 200 270 240 260C280 250 320 220 340 190C360 160 360 130 340 110C320 90 280 80 240 90C200 100 160 130 140 160C120 190 120 220 140 240Z" fill="#F8CC29" fillOpacity="0.7" />
        <path d="M160 120C180 90 220 70 260 80C300 90 340 120 360 150C380 180 380 210 360 230C340 250 300 260 260 250C220 240 180 210 160 180C140 150 140 150 160 120Z" fill="#E08E3C" fillOpacity="0.7" />
        
        {/* Logo ENSIT */}
        <path d="M150 130L150 230L300 230L300 130L150 130Z" fill="#E32726" />
        <path d="M170 150L280 150L280 160L170 160L170 150Z" fill="white" />
        <path d="M170 170L280 170L280 180L170 180L170 170Z" fill="white" />
        <path d="M170 190L280 190L280 200L170 200L170 190Z" fill="white" />
        <path d="M170 210L280 210L280 220L170 220L170 210Z" fill="white" />
        
        {/* Ligne horizontale supérieure */}
        <path d="M100 280L300 280" stroke="#333" strokeWidth="2" />
        
        {/* Texte "Ecole Nationale Supérieure d'Ingénieurs de Tunis" */}
        <text x="200" y="310" fontFamily="Arial" fontSize="16" fontWeight="500" fill="#333" textAnchor="middle">
          Ecole Nationale
        </text>
        <text x="200" y="330" fontFamily="Arial" fontSize="16" fontWeight="500" fill="#333" textAnchor="middle">
          Supérieure
        </text>
        <text x="200" y="350" fontFamily="Arial" fontSize="16" fontWeight="500" fill="#333" textAnchor="middle">
          d'Ingénieurs
        </text>
        <text x="200" y="370" fontFamily="Arial" fontSize="16" fontWeight="500" fill="#333" textAnchor="middle">
          de Tunis
        </text>
        
        {/* Ligne horizontale inférieure */}
        <path d="M100 390L300 390" stroke="#333" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default EnsitLogo;
