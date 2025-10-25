import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import PricingSection from './components/PricingSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import WhatsAppButton from './components/WhatsAppButton';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-[#fae894] overflow-x-hidden">
      <Navbar />
      <SocialSidebar />
      <Header />
      <main>
        <PricingSection />
        <AboutSection />
        <GallerySection />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default App;