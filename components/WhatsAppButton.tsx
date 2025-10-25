import React from 'react';

const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/5511999999999" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl"
    >
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.2 15.3c-.28-.14-1.67-.82-1.93-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.89 1.1-.16.19-.32.21-.6.07-.28-.14-1.18-.44-2.25-1.39-1.07-.95-1.79-2.12-2.1-2.49-.31-.37-.03-.57.12-.71.13-.13.28-.32.42-.48.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5s-.64-1.54-.87-2.1c-.24-.56-.48-.48-.64-.49-.16-.01-.34-.01-.53-.01s-.45.07-.68.31c-.24.24-.92 1.01-1.13 2.37-.21 1.36.73 2.76.84 2.96.11.2 1.48 2.3 3.58 3.19 2.1 0.89 2.1 0.59 2.48 0.56.38-.03 1.18-.48 1.34-0.95s0.16-0.87 0.11-0.95c-.05-0.08-.19-0.13-.28-0.18z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;