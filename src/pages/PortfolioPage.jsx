import React, { useState, useMemo } from 'react';
import { Maximize2 } from 'lucide-react';
import { CATEGORIES, portfolioItems } from '../data/studioData';
import Banner from '../components/Banner';
import Lightbox from '../components/Lightbox';
import SEO from '../components/SEO';

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(16);
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0 });

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return portfolioItems;
    return portfolioItems.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  const visibleItems = filteredItems.slice(0, displayLimit);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setDisplayLimit(16);
  };

  return (
    <>
      <SEO
        title="Portfolio"
        description="Koleksi foto portofolio 70 Studio Jakarta Timur. Prewedding, Wisuda, Keluarga, Group, Maternity, Model, Personal, dan Birthday photoshoot."
        path="/portfolio"
      />

      {/* Banner identical to Home */}
      <Banner
        scrollToId="#portfolio-gallery"
        subtitle="Portfolio — Timeless memories, lovingly captured"
      />

      {/* Portfolio Content */}
      <section id="portfolio-gallery" className="section_padding">
        <div className="container">
          {/* Section Title */}
          <div className="section_title">
            <span className="subtitle font-modernline">Curated Gallery</span>
            <h2>Koleksi Portofolio</h2>
            <p>
              Pilihan karya fotografi 70 Studio dalam balutan pencahayaan alami & tone sinematik yang abadi.
            </p>
          </div>

          {/* Interactive Category Filter Pills (Only Titles, Original Style) */}
          <div className="portfolio_filter_bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`filter_pill ${activeCategory.toLowerCase() === cat.id.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="gallery_grid">
            {visibleItems.map((item, idx) => (
              <div
                key={item.id}
                className="gallery_item"
                onClick={() => setLightbox({ open: true, items: filteredItems, index: idx })}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="gallery_overlay">
                  <div className="zoom_icon">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredItems.length > displayLimit && (
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button className="btn_outline" onClick={() => setDisplayLimit((p) => p + 16)}>
                Lihat Foto Lainnya ({filteredItems.length - displayLimit} tersisa)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
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
