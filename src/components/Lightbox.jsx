import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/studioData';

export default function Lightbox({ items, currentIndex, onClose, onNavigate }) {
  const currentPhoto = items[currentIndex];

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  if (!currentPhoto) return null;

  const inquiryMessage = `Halo 70 Studio, saya tertarik dengan konsep foto ${currentPhoto.category} (${currentPhoto.title}). Boleh info paket & jadwalnya?`;

  return (
    <div className="lightbox_backdrop" onClick={onClose}>
      {/* Close Button */}
      <button 
        className="lightbox_close" 
        onClick={onClose}
        aria-label="Tutup Tampilan Foto"
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            className="lightbox_nav lightbox_prev"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + items.length) % items.length);
            }}
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            className="lightbox_nav lightbox_next"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % items.length);
            }}
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div className="lightbox_content" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentPhoto.src}
          alt={currentPhoto.title}
          className="lightbox_img"
        />

        <div className="lightbox_info">
          <div>
            <h3 className="lightbox_title font-bangla">{currentPhoto.title}</h3>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Kategori: {currentPhoto.category} ({currentIndex + 1} dari {items.length})
            </span>
          </div>

          <a
            href={STUDIO_INFO.getWhatsAppUrl(inquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn_whatsapp"
            style={{ padding: '8px 18px', fontSize: '0.82rem' }}
          >
            <MessageCircle size={16} />
            <span>Tanya Konsep Ini di WA</span>
          </a>
        </div>
      </div>
    </div>
  );
}
