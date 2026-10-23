import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { STUDIO_INFO, CATEGORIES, portfolioItems } from '../data/studioData';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { getImageUrl } from '../utils/request';

/* Fallback representative portfolio photos for the slideshow */
const DEFAULT_SLIDES = CATEGORIES
  .filter((c) => c.id !== 'all')
  .map((cat) => {
    const photos = portfolioItems.filter((p) => p.category.toLowerCase() === cat.id.toLowerCase());
    return {
      src: photos.length > 0 ? photos[Math.floor(photos.length / 2)].src : cat.cover,
      title: '70 Studio',
      subtitle: cat.desc || STUDIO_INFO.tagline,
      badge: cat.label
    };
  });

export default function Banner({
  mainTitle = '70',
  scriptTitle = 'Studio',
  title = null,
  subtitle = STUDIO_INFO.tagline,
  badge = null,
  scrollToId = '#content',
  showScrollCta = true,
  slides = null,
  compact = false
}) {
  const [slideData, setSlideData] = useState(slides || DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeClass, setFadeClass] = useState('hero_slide_visible');
  const [isPaused, setIsPaused] = useState(false);

  // Touch & Swipe tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const isSwiping = useRef(false);

  // Fetch active banners from API
  useEffect(() => {
    let isMounted = true;
    async function loadBanners() {
      try {
        const res = await api.get(API_ENDPOINTS.BANNERS.LIST, { params: { active: 'true' } });
        if (res.data?.success && res.data.data?.length > 0) {
          if (isMounted) {
            const formatted = res.data.data.map((b) => ({
              src: getImageUrl(b.image_url),
              title: b.title || '70 Studio',
              subtitle: b.subtitle || subtitle,
              badge: b.badge || null,
            }));
            setSlideData(formatted);
          }
        }
      } catch (err) {
        // Gracefully use local default slides
      }
    }
    if (!slides) {
      loadBanners();
    }
    return () => { isMounted = false; };
  }, [slides, subtitle]);

  const slideList = slideData && slideData.length > 0 ? slideData : DEFAULT_SLIDES;

  const goToNextSlide = useCallback(() => {
    setFadeClass('hero_slide_hidden');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideList.length);
      setFadeClass('hero_slide_visible');
    }, 300);
  }, [slideList.length]);

  const goToPrevSlide = useCallback(() => {
    setFadeClass('hero_slide_hidden');
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slideList.length) % slideList.length);
      setFadeClass('hero_slide_visible');
    }, 300);
  }, [slideList.length]);

  const goToSlide = (idx) => {
    if (idx === currentSlide) return;
    setFadeClass('hero_slide_hidden');
    setTimeout(() => {
      setCurrentSlide(idx);
      setFadeClass('hero_slide_visible');
    }, 300);
  };

  // Auto-advance slideshow with pause on hover/touch
  useEffect(() => {
    if (slideList.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [slideList.length, isPaused, goToNextSlide]);

  // Touch Swipe Event Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = Math.abs(touchStartY.current - touchEndY.current);

    // Only swipe if horizontal movement is significant and dominant over vertical scroll
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swiped Left -> Next Slide
        goToNextSlide();
      } else {
        // Swiped Right -> Previous Slide
        goToPrevSlide();
      }
    }
    // Resume auto-slide after 3 seconds
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleScroll = (e) => {
    e.preventDefault();
    if (scrollToId) {
      const target = document.querySelector(scrollToId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
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

  const activeItem = slideList[currentSlide] || {};
  const activeBadge = badge || activeItem.badge;
  const activeSubtitle = activeItem.subtitle || subtitle;

  return (
    <section
      className={`hero_banner ${compact ? 'hero_compact' : ''} select-none group relative overflow-hidden`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slideshow images */}
      {slideList.map((item, idx) => {
        const bgUrl = typeof item === 'string' ? item : item.src;
        return (
          <div
            key={`${bgUrl}-${idx}`}
            className={`hero_bg_slide ${idx === currentSlide ? fadeClass : 'hero_slide_hidden'}`}
            style={{
              backgroundImage: `url(${bgUrl})`,
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out',
              transform: idx === currentSlide ? 'scale(1.03)' : 'scale(1)'
            }}
          />
        );
      })}

      {/* Dark overlay */}
      <div className="hero_overlay" />

      {/* Interactive Navigation Arrows (Swipe / Slide Controls) */}
      {slideList.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={goToNextSlide}
            aria-label="Next Slide"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Content */}
      <div className="container hero_container relative z-10">
        <div className="hero_content">
          {activeBadge && (
            <span className="hero_badge transition-all duration-300">
              {activeBadge}
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

          {activeSubtitle && (
            <p className="tagline transition-all duration-300">
              {activeSubtitle}
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

      {/* Slide indicators & Swipe hint */}
      {slideList.length > 1 && (
        <div className="hero_indicators z-20">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              className={`hero_dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
