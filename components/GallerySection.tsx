
import React from 'react';
import { galleryImages } from '../constants';

const GalleryImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-square">
    <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
  </div>
);

const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#070743]">
      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-russo-one">Nossa Galeria</h2>
          <p className="mt-4 text-xl text-[#fae894] max-w-3xl mx-auto">
            Veja a transformação e o brilho que entregamos em cada serviço.
          </p>
          <div className="mt-4 w-24 h-1 bg-[#169d99] mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <GalleryImage key={index} src={image.src} alt={image.alt} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
