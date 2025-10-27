import React, { useState, useEffect } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverColorClass: string;
  underlineColorClass: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick, hoverColorClass, underlineColorClass }) => (
  <a 
    href={href} 
    onClick={onClick} 
    className={`font-russo-one relative block md:inline-block py-2 px-4 text-lg font-medium uppercase text-white transition-colors duration-300 group nav-link-animated ${hoverColorClass} nav-link-shadow`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 ${underlineColorClass} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center`}></span>
  </a>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "#home", text: "Home", hoverColor: "hover:text-[#00eaff]", underlineColor: "bg-[#00eaff]" },
    { href: "#pricing", text: "Serviços", hoverColor: "hover:text-[#00eaff]", underlineColor: "bg-[#00eaff]" },
    { href: "#about", text: "Sobre Nós", hoverColor: "hover:text-[#b9cc01]", underlineColor: "bg-[#b9cc01]" },
    { href: "#gallery", text: "Galeria", hoverColor: "hover:text-[#b9cc01]", underlineColor: "bg-[#b9cc01]" },
    { href: "#contact", text: "Contato", hoverColor: "hover:text-[#00eaff]", underlineColor: "bg-[#00eaff]" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[#070743]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a 
              href="#home" 
              className="text-3xl font-black uppercase text-white font-russo-one" 
              onClick={closeMenu}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              Aqua<span className="text-[#00eaff]">Clean</span>
            </a>
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map(link => (
                <NavLink 
                  key={link.text} 
                  href={link.href} 
                  hoverColorClass={link.hoverColor} 
                  underlineColorClass={link.underlineColor}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 bg-[#070743] w-4/5 max-w-sm z-50 shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8">
            <div className="flex justify-end mb-8">
                 <button
                    onClick={closeMenu}
                    className="text-white focus:outline-none"
                    aria-label="Close menu"
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col items-start space-y-6">
              {navLinks.map(link => (
                  <NavLink 
                    key={link.text} 
                    href={link.href} 
                    onClick={closeMenu}
                    hoverColorClass={link.hoverColor} 
                    underlineColorClass={link.underlineColor}
                  >
                    {link.text}
                  </NavLink>
              ))}
            </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;