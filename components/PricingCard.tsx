
import React from 'react';
import { PricingOption } from '../types';

interface PricingCardProps {
  option: PricingOption;
}

const PricingCard: React.FC<PricingCardProps> = ({ option }) => {
  const defaultBg = 'https://i.postimg.cc/5tktLmkW/AQP8r-b-AUFg-M-jmllpk-XUOLERi-Az-K9M-Zp-Dv2f-E-HAKP4phdd-NEEE3f-Yeno-Mcghg-Yf-UXCZlf3FD5Usq-MBFPSEx-Ku0BXMo-W31b-A.png';
  
  return (
    <div 
      className="relative border-2 border-[#169d99] rounded-2xl p-8 shadow-lg transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ab0768]/30 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url('${option.backgroundImage || defaultBg}')` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 flex flex-col items-center text-center h-full">
        <div className="mb-4">
            {option.icon}
        </div>
        <h3 className="text-2xl font-bold text-white uppercase mb-2">{option.vehicleType}</h3>
        <p className="text-[#fae894] font-light mb-6 h-20">{option.description}</p>
        <div className="mt-auto">
            <p className="text-5xl font-black text-white">
                <span className="text-3xl text-[#b9cc01] align-top">R$</span>
                {option.price.toFixed(2).replace('.', ',')}
            </p>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;