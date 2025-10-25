import React from 'react';

const Feature: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="text-center p-6 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-black/40 hover:border-white/20 hover:scale-105 transform">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#169d99] mx-auto mb-4 text-[#070743]">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-[#fae894] mb-2">{title}</h3>
    <p className="text-white">{text}</p>
  </div>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M19 3v4M17 5h4M12 3v4M10 5h4M5 21v-4M3 19h4M19 21v-4M17 19h4M12 21v-4M10 19h4M12 11a1 1 0 100-2 1 1 0 000 2zM12 17a1 1 0 100-2 1 1 0 000 2zM5 12a1 1 0 100-2 1 1 0 000 2zM19 12a1 1 0 100-2 1 1 0 000 2z" /></svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 2.5 9-2.5a12.02 12.02 0 00-2.382-9.975z" /></svg>
);


const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0a0a5c] to-[#070743]">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-russo-one">Por que nos escolher?</h2>
            <p className="mt-4 text-xl text-[#fae894] max-w-3xl mx-auto">
                Garantimos um serviço de excelência com os melhores produtos do mercado.
            </p>
            <div className="mt-4 w-24 h-1 bg-[#ab0768] mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<SparklesIcon />}
            title="Produtos de Ponta"
            text="Utilizamos apenas produtos biodegradáveis de alta performance que protegem a pintura."
          />
          <Feature
            icon={<CheckIcon />}
            title="Atenção aos Detalhes"
            text="Nossa equipe é treinada para não deixar nenhum detalhe passar, do pneu ao teto."
          />
          <Feature
            icon={<ShieldIcon />}
            title="Cuidado Garantido"
            text="Tratamos cada veículo como se fosse nosso. Satisfação total ou seu dinheiro de volta."
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;