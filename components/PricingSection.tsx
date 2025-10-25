import React from 'react';
import { PRICING_DATA } from '../constants';
import PricingCard from './PricingCard';

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#070743] to-[#0a0a5c]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-russo-one">Nossos Serviços e Preços</h2>
          <p className="mt-4 text-xl text-[#fae894] max-w-3xl mx-auto">
            Planos flexíveis para todos os tipos de veículos. Escolha o ideal para você.
          </p>
          <div className="mt-4 w-24 h-1 bg-[#169d99] mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING_DATA.map((option) => (
            <PricingCard key={option.vehicleType} option={option} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;