import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { STUDIO_INFO, CATEGORIES, portfolioItems } from '../data/studioData';

/* Representative portfolio photos for the slideshow */
const DEFAULT_SLIDES = CATEGORIES
  .filter((c) => c.id !== 'all')
  .map((cat) => {
    const photos = portfolioItems.filter((p) => p.category === cat.id);
    return photos.length > 0 ? photos[Math.floor(photos.length / 2)].src : cat.cover;
  });

export default function Banner({
  mainTitle = '70',
  scriptTitle = 'Studio',
  title = null,
  subtitle = STUDIO_INFO.tagline,
  badge = null,
  scrollToId = '#content',
  showScrollCta = true,
  slides = DEFAULT_SLIDES,
  compact = false
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeClass, setFadeClass] = useState('hero_slide_visible');

  const slideList = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  /* Auto-advance slideshow with fade transition */
  useEffect(() => {
    if (slideList.length <= 1) return;
    const interval = setInterval(() => {
      setFadeClass('hero_slide_hidden');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideList.length);
        setFadeClass('hero_slide_visible');
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideList.length]);

  const handleScroll = (e) => {
    e.preventDefault();
    if (scrollToId) {
      const target = document.querySelector(scrollToId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDotClick = (idx) => {
    setFadeClass('hero_slide_hidden');
    setTimeout(() => {
      setCurrentSlide(idx);
      setFadeClass('hero_slide_visible');
    }, 400);
  };

  let renderedMain = mainTitle;
  let renderedScript = scriptTitle;
  if (typeof title === 'string') {
    renderedMain = title;
    renderedScript = null;
  } else if (title && typeof title === 'object') {
    renderedMain = title.main ?? mainTitle;
    renderedScript = title.script ?? scriptTitle;
  }

  return (
    <section className={`hero_banner ${compact ? 'hero_compact' : ''}`}>
      {/* Background slideshow images */}
      {slideList.map((src, idx) => (
        <div
          key={src}
          className={`hero_bg_slide ${idx === currentSlide ? fadeClass : 'hero_slide_hidden'}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      {/* Dark overlay matching Home */}
      <div className="hero_overlay" />

      {/* Content */}
      <div className="container hero_container">
        <div className="hero_content">
          {badge && (
            <span className="hero_badge">
              {badge}
            </span>
          )}

          <h1 className="font-bangla">
            {renderedMain}
            {renderedScript && (
              <>
                {' '}
                <span className="script_word font-modernline">{renderedScript}</span>
              </>
            )}
          </h1>

          {subtitle && (
            <p className="tagline">
              {subtitle}
            </p>
          )}

          {showScrollCta && (
            <a href={scrollToId} onClick={handleScroll} className="hero_scroll_cta">
              <span>Explore</span>
              <ChevronDown size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Slide indicators */}
      {slideList.length > 1 && (
        <div className="hero_indicators">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              className={`hero_dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
