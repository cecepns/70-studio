import React from 'react';
import { STUDIO_INFO } from '../data/studioData';

export default function WhatsAppFloating() {
  return (
    <a
      href={STUDIO_INFO.getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp_floating"
      aria-label="Hubungi 70 Studio via WhatsApp"
    >
      <span className="whatsapp_floating_tooltip">
        Chat dengan 70 Studio
      </span>

      <div className="whatsapp_floating_btn">
        <img
          src="/img/whatsapp.svg"
          alt="WhatsApp"
          style={{ width: '32px', height: '32px' }}
        />
      </div>
    </a>
  );
}
