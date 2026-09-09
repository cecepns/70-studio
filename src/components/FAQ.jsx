import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQS, STUDIO_INFO } from '../data/studioData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section_padding bg_gray">
      <div className="container">
        <div className="section_title">
          <span className="subtitle font-modernline">Got Questions?</span>
          <h2>Pertanyaan Umum (FAQ)</h2>
          <p>
            Informasi penting seputar prosedur booking, persiapan sesi, dan layanan 70 Studio.
          </p>
        </div>

        <div className="faq_grid">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq_item">
                <button
                  className="faq_header"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
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

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ marginBottom: '14px' }}>Masih memiliki pertanyaan lain seputar sesi pemotretan Anda?</p>
          <a
            href={STUDIO_INFO.getWhatsAppUrl('Halo 70 Studio, saya ingin bertanya lebih lanjut mengenai layanan foto.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn_whatsapp"
          >
            <MessageCircle size={18} />
            <span>Tanya Admin Langsung</span>
          </a>
        </div>
      </div>
    </section>
  );
}
