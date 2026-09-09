import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

/* Interior & facility photos of 70 Studio from assets/foto-studio */
const STUDIO_IMAGES = [
  '/foto-studio/studio-1.jpg',
  '/foto-studio/studio-2.jpg',
  '/foto-studio/studio-3.jpg'
];

export default function About({ id = 'about' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeClass, setFadeClass] = useState('about_slide_visible');

  /* Auto-advance studio photo slideshow with smooth fade */
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('about_slide_hidden');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % STUDIO_IMAGES.length);
        setFadeClass('about_slide_visible');
      }, 800);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id={id} className="section_padding" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="about_grid">
          {/* Left: Clean text */}
          <div className="about_text">
            <h5 className="font-modernline">About Us</h5>
            <h2 className="font-bangla">Cerita Abadi Lewat Lensa</h2>
            <p>
              <strong>70 Studio</strong> hadir di Duren Sawit, Jakarta Timur, dengan visi menghadirkan pengalaman fotografi yang hangat, elegan, dan nyaman.
            </p>
            <p>
              Estetika visual yang bersih, pencahayaan berstandar profesional, dan arahan pose yang mengalir natural — setiap jepretan dirancang untuk menjadi kenangan yang selalu indah.
            </p>

            <div className="about_stats">
              <div className="stat_item">
                <h3 className="font-bangla">8+</h3>
                <span>Kategori</span>
              </div>
              <div className="stat_item">
                <h3 className="font-bangla">1000+</h3>
                <span>Momen</span>
              </div>
              <div className="stat_item">
                <h3 className="font-bangla">100%</h3>
                <span>Dedikasi</span>
              </div>
            </div>
          </div>

          {/* Right: Studio Photo Slideshow with Fade Animation */}
          <div className="about_image_wrapper">
            <div className="about_slideshow_container">
              {STUDIO_IMAGES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`70 Studio Foto ${idx + 1}`}
                  className={`about_main_img ${idx === currentSlide ? fadeClass : 'about_slide_hidden'}`}
                  loading="lazy"
                />
              ))}
            </div>

            <div className="about_badge_card">
              <Sparkles size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <div>
                <h4 className="font-bangla">Studio Profesional</h4>
                <p>Ber-AC, ruang ganti privat, & tata cahaya profesional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
