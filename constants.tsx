
import React from 'react';
import { PricingOption } from './types';

interface IconProps {
    className?: string;
}

const CarIcon: React.FC<IconProps> = ({ className = "h-16 w-16" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[#b9cc01]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16.942a2 2 0 1 1-4 0M7 16.942a2 2 0 1 1-4 0M19 8l-2 3M5 8l2 3M2 12h1.5M20.5 12H22M5.5 12h13M3 12v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
    </svg>
);

const SuvIcon: React.FC<IconProps> = ({ className = "h-16 w-16" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[#b9cc01]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16.942a2 2 0 1 1-4 0M7 16.942a2 2 0 1 1-4 0M19 12h3M2 12h3M18 12l1-5H5l1 5h12zM5.9 7l-.9-2.43A1 1 0 0 1 5.95 3h12.1a1 1 0 0 1 .96.57L18.1 7H5.9zM3 12v4h18v-4" />
    </svg>
);

const PickupIcon: React.FC<IconProps> = ({ className = "h-16 w-16" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[#b9cc01]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16.942a2 2 0 1 1-4 0M7 16.942a2 2 0 1 1-4 0M22 12h-3M2 12h3M14 12H5.5a2.5 2.5 0 0 0-2.5 2.5V17h16v-2a3 3 0 0 0-3-3H14zm-2-7L10 2H5l2 3h5zM12 5V2" />
    </svg>
);

const TruckIcon: React.FC<IconProps> = ({ className = "h-16 w-16" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[#b9cc01]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16.942a2 2 0 1 1-4 0M7 16.942a2 2 0 1 1-4 0M22 17H17V7h5v10zM17 17H3V4h14v13z" />
    </svg>
);


export const PRICING_DATA: PricingOption[] = [
  {
    vehicleType: 'Carros de Passeio',
    price: 50,
    description: 'Limpeza completa para seu carro do dia a dia. Interior e exterior brilhando.',
    icon: <CarIcon />,
    backgroundImage: 'https://i.postimg.cc/C51LXmM5/imagem-de-frente-de-um-carro-de.png',
  },
  {
    vehicleType: 'Caminhonetes',
    price: 100,
    description: 'Cuidado especial para SUVs e caminhonetes, removendo toda a sujeira.',
    icon: <SuvIcon />,
    backgroundImage: 'https://i.postimg.cc/15c1wbGX/honda-hr-v-azul-com-um-fundo-em.png',
  },
  {
    vehicleType: 'Pick-Ups',
    price: 150,
    description: 'Tratamento robusto para pick-ups, incluindo limpeza detalhada da caçamba.',
    icon: <PickupIcon />,
    backgroundImage: 'https://i.postimg.cc/V6RHdcyZ/toyota-hilux-azul-com-um-fundo-degradado.png',
  },
  {
    vehicleType: 'Veículos Pesados',
    price: 250,
    description: 'Lavagem de alta pressão para caminhões e veículos de grande porte.',
    icon: <TruckIcon />,
    backgroundImage: 'https://i.postimg.cc/YS759RGz/uma-scania-r540-azul-com-o-fundo.png',
  },
];

export const galleryImages = [
    { src: "https://i.postimg.cc/CLkNrg5Z/lavagem-de-carro-de-luxo-azul-farois.png", alt: "Lavagem detalhada do farol de um carro de luxo azul" },
    { src: "https://i.postimg.cc/3rP1ZR8y/polimento-de-carro-de-passeio-azul-parte.png", alt: "Profissional polindo a lataria de um carro azul" },
    { src: "https://i.postimg.cc/HWJ355gH/limpeza-de-volante-de-suv-azul-parte.png", alt: "Limpeza minuciosa do volante de um SUV" },
    { src: "https://i.postimg.cc/QNBS55rp/painel-honda-hr-v-limpo.png", alt: "Painel de um Honda HR-V completamente limpo e brilhando" },
    { src: "https://i.postimg.cc/YqY3DH0h/lavagem-de-roda-de-pick-up-azul.png", alt: "Roda de uma pick-up azul sendo lavada com espuma" },
    { src: "https://i.postimg.cc/KcKQLLyr/ca-amba-de-pick-up-azul-rec-m-limpa.png", alt: "Caçamba de uma pick-up azul impecavelmente limpa" },
    { src: "https://i.postimg.cc/9X41TTjg/lavando-carro-suv-caminh-o-lavando-roda-parte-1.png", alt: "Lavagem de alta pressão na roda de um SUV" },
    { src: "https://i.postimg.cc/qBtQnndm/limpeza-de-vidro-de-caminh-o-cor-azul.png", alt: "Vidro de um caminhão azul sendo limpo para máxima visibilidade" },
    { src: "https://i.postimg.cc/8kq4b512/lavagem-de-roda-de-pick-up-azul-1.png", alt: "Detalhe da limpeza de uma roda de liga leve" }
];
