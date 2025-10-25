import React, { useState, useEffect, useRef } from 'react';

const Header: React.FC = () => {
  // A coleção de vídeos que fará a transição em loop
  const videoUrls = [
    'https://ik.imagekit.io/marioigor82/lavagem%20traseira.mp4?updatedAt=1761224506114',
    'https://ik.imagekit.io/marioigor82/Laagem%20de%20carro.mp4?updatedAt=1761224506186',
    'https://ik.imagekit.io/marioigor82/lavagem%20de%20roda.mp4?updatedAt=1761224505628',
    'https://ik.imagekit.io/marioigor82/Laagem%20de%20carro%20-%20interno.mp4?updatedAt=1761224505653',
    'https://ik.imagekit.io/marioigor82/LAVA%20R%C3%81PIDO.mp4?updatedAt=1761224506239',
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Efeito para gerenciar a reprodução e a transição contínua de forma mais robusta
  useEffect(() => {
    const handleVideoEnd = () => {
      // Apenas atualiza o índice. O useEffect cuidará de reproduzir o próximo vídeo.
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
    };

    const currentVideo = videoRefs.current[currentVideoIndex];
    if (!currentVideo) return;

    // Pausamos todos os outros vídeos para garantir uma transição limpa
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideoIndex) {
        video.pause();
      }
    });
    
    // Função para tentar reproduzir o vídeo, garantindo que ele esteja pronto
    const attemptPlay = () => {
      // Garante que o vídeo comece do início
      currentVideo.currentTime = 0;
      const playPromise = currentVideo.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Captura erros comuns de autoplay, como a necessidade de interação do usuário
          // ou o erro "no supported sources" se houver uma condição de corrida.
          console.warn(`A reprodução automática do vídeo ${currentVideoIndex} foi impedida pelo navegador:`, error.message);
        });
      }
    };

    // Adiciona o listener para o final do vídeo
    currentVideo.addEventListener('ended', handleVideoEnd);
    
    // Verifica se o vídeo já tem dados suficientes para tocar (readyState >= 3)
    // Se não, espera pelo evento 'canplay' para evitar erros.
    if (currentVideo.readyState >= 3) {
      attemptPlay();
    } else {
      currentVideo.addEventListener('canplay', attemptPlay, { once: true });
    }

    // Função de limpeza para remover os listeners do vídeo anterior
    return () => {
      currentVideo.removeEventListener('ended', handleVideoEnd);
      // O 'canplay' listener é removido automaticamente por causa do { once: true },
      // mas é uma boa prática remover explicitamente em caso de re-renderizações inesperadas.
      currentVideo.removeEventListener('canplay', attemptPlay);
    };
  }, [currentVideoIndex, videoUrls.length]);


  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        {videoUrls.map((url, index) => (
          <video
            ref={(el) => { videoRefs.current[index] = el; }}
            key={url}
            src={url}
            muted
            playsInline
            preload="auto"
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ease-in-out ${
              index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-[.11]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070743] via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 p-4 animate-fadeIn animate-delay-300">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-4 font-russo-one" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.7)' }}>
          Aqua<span className="text-[#00eaff]">Clean</span>
        </h1>
        <p className="text-lg md:text-2xl font-light text-gray-200 max-w-2xl mx-auto mb-8 animate-slideInUp animate-delay-500" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          O tratamento premium que seu veículo merece. Qualidade, brilho e cuidado em cada detalhe.
        </p>
        <a
          href="#pricing"
          className="bg-[#169d99] text-white font-bold text-lg py-3 px-8 rounded-full uppercase tracking-wider transition-all duration-300 ease-in-out hover:bg-[#b9cc01] hover:text-[#070743] hover:shadow-lg hover:scale-105 transform animate-slideInUp animate-delay-700"
        >
          Nossos Serviços
        </a>
      </div>
    </section>
  );
};

export default Header;