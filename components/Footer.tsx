import React from 'react';

const socialLinks = [
  { href: "#", label: "Facebook", hoverClass: "hover:text-[#1877F2]", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg> },
  { href: "#", label: "Instagram", hoverClass: "hover:text-[#E4405F]", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm-1.002 6.363a4.648 4.648 0 11-3.284 3.283 4.648 4.648 0 013.284-3.283zm-4.634 4.635a3.149 3.149 0 103.149-3.149 3.149 3.149 0 00-3.149 3.149z" clipRule="evenodd" /></svg> },
  { href: "#", label: "X", hoverClass: "hover:text-white", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
  { href: "#", label: "YouTube", hoverClass: "hover:text-[#FF0000]", icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> }
];

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-[#169d99]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-[#169d99]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-[#169d99]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative text-white overflow-hidden bg-gradient-to-t from-[#0a0a5c] to-[#070743]">
        <div className="relative z-20 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Column 1: About */}
                <div className="space-y-6">
                    <a
                      href="#home"
                      className="text-3xl font-black uppercase text-white font-russo-one"
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                    >
                        Aqua<span className="text-[#00eaff]">Clean</span>
                    </a>
                    <p className="text-[#fae894]/80 text-sm">
                        Oferecendo serviços de lavagem de carros premium com atenção meticulosa aos detalhes, garantindo que seu veículo saia impecável.
                    </p>
                    <div className="flex space-x-4">
                        {socialLinks.map(link => (
                            <a key={link.label} href={link.href} aria-label={link.label} className={`text-[#00eaff] ${link.hoverClass} transition-all duration-300 transform hover:scale-125`}>
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Navigation Links */}
                <div>
                    <h3 className="text-xl font-bold uppercase text-[#fae894] mb-6 tracking-wider">Navegação</h3>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#home" className="hover:text-[#169d99] transition-colors duration-300">Home</a></li>
                        <li><a href="#about" className="hover:text-[#169d99] transition-colors duration-300">Sobre Nós</a></li>
                        <li><a href="#pricing" className="hover:text-[#169d99] transition-colors duration-300">Serviços</a></li>
                        <li><a href="#gallery" className="hover:text-[#169d99] transition-colors duration-300">Galeria</a></li>
                    </ul>
                </div>
                
                {/* Column 3: Services */}
                <div>
                    <h3 className="text-xl font-bold uppercase text-[#fae894] mb-6 tracking-wider">Serviços</h3>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#pricing" className="hover:text-[#169d99] transition-colors duration-300">Carros de Passeio</a></li>
                        <li><a href="#pricing" className="hover:text-[#169d99] transition-colors duration-300">Caminhonetes</a></li>
                        <li><a href="#pricing" className="hover:text-[#169d99] transition-colors duration-300">Pick-Ups</a></li>
                        <li><a href="#pricing" className="hover:text-[#169d99] transition-colors duration-300">Veículos Pesados</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact Info */}
                <div>
                    <h3 className="text-xl font-bold uppercase text-[#fae894] mb-6 tracking-wider">Contato</h3>
                    <ul className="space-y-5 text-sm text-[#fae894]/90">
                        <li className="flex items-start">
                            <LocationIcon />
                            <span>Rua Fictícia, 123, Bairro Imaginário, Cidade Exemplo - SP</span>
                        </li>
                        <li className="flex items-center">
                            <PhoneIcon />
                            <a href="tel:+5511999999999" className="hover:text-[#169d99] transition-colors duration-300">(11) 99999-9999</a>
                        </li>
                        <li className="flex items-center">
                            <MailIcon />
                            <a href="mailto:contato@aquaclean.com" className="hover:text-[#169d99] transition-colors duration-300">contato@aquaclean.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[#169d99]/30 text-center text-sm text-[#fae894]/70">
                <p>&copy; {new Date().getFullYear()} AquaClean Car Wash. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;