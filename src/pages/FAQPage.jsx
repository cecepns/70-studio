import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQS, STUDIO_INFO } from '../data/studioData';
import Banner from '../components/Banner';
import SEO from '../components/SEO';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <SEO
        title="FAQ"
        description="Pertanyaan umum seputar booking sesi foto, persiapan pemotretan, dan layanan 70 Studio Jakarta Timur."
        path="/faq"
      />

      {/* Banner identical to Home */}
      <Banner
        scrollToId="#faq-content"
        subtitle="FAQ — Timeless memories, lovingly captured"
      />

      <section id="faq-content" className="section_padding">
        <div className="container">
          <div className="section_title">
            <span className="subtitle font-modernline">
              Frequently Asked
            </span>
            <h2 className="font-bangla">
              Questions & Answers
            </h2>
            <p>
              Informasi lengkap seputar pemesanan jadwal, persiapan sesi photoshoot, dan ketentuan layanan di 70 Studio.
            </p>
          </div>

          <div className="faq_grid">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="faq_item">
                  <button
                    className="faq_header"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="faq_body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ marginBottom: '14px', color: 'var(--color-muted)' }}>Masih ada pertanyaan lain?</p>
            <a
              href={STUDIO_INFO.getWhatsAppUrl('Halo 70 Studio, saya ingin bertanya lebih lanjut.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn_whatsapp"
            >
              <MessageCircle size={18} />
              <span>Tanya Admin via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
