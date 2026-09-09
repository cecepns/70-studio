import React, { useState } from 'react';
import Banner from '../components/Banner';
import CategoryShowcase from '../components/CategoryShowcase';
import About from '../components/About';
import Contact from '../components/Contact';
import Lightbox from '../components/Lightbox';
import SEO from '../components/SEO';

export default function HomePage() {
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0 });

  const handleSelectPhoto = (items, index) => {
    setLightbox({ open: true, items, index });
  };

  return (
    <>
      <SEO
        title={null}
        description="Studio foto profesional di Duren Sawit Jakarta Timur. Melayani Prewedding, Family, Graduation, Group, Maternity, Model, Personal, & Birthday. Abadikan momen berharga dengan estetika terbaik."
        path="/"
      />

      {/* Banner with smooth scroll to Portfolio showcase */}
      <Banner scrollToId="#portfolio" />

      {/* Category Filter & Portfolio Showcase */}
      <CategoryShowcase onSelectPhoto={handleSelectPhoto} />

      {/* About Section */}
      <About />

      {/* Contact Section */}
      <Contact />

      {/* Lightbox for previewing photos */}
      {lightbox.open && (
        <Lightbox
          items={lightbox.items}
          currentIndex={lightbox.index}
          onClose={() => setLightbox((p) => ({ ...p, open: false }))}
          onNavigate={(i) => setLightbox((p) => ({ ...p, index: i }))}
        />
      )}
    </>
  );
}
