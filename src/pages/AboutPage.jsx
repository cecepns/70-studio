import React from 'react';
import Banner from '../components/Banner';
import About from '../components/About';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        description="Tentang 70 Studio — Studio foto profesional di Duren Sawit, Jakarta Timur dengan estetika visual bersih dan pencahayaan berstandar profesional."
        path="/about"
      />

      {/* Banner identical to Home */}
      <Banner
        scrollToId="#about-content"
        subtitle="About Us — Timeless memories, lovingly captured"
      />

      <About id="about-content" />
    </>
  );
}
