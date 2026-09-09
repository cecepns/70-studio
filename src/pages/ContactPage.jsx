import React from 'react';
import Banner from '../components/Banner';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Hubungi 70 Studio di Jl. Selat Bali, Duren Sawit, Jakarta Timur. WhatsApp 082299963635, Email Studiofoto70@gmail.com. Buka setiap hari 09:00-21:00 WIB."
        path="/contact"
      />

      {/* Banner identical to Home */}
      <Banner
        scrollToId="#contact-page"
        subtitle="Contact — Timeless memories, lovingly captured"
      />

      <Contact id="contact-page" />
    </>
  );
}
