import React, { useState, useMemo } from 'react';
import { Maximize2 } from 'lucide-react';
import { CATEGORIES, portfolioItems } from '../data/studioData';

export default function CategoryShowcase({ onSelectPhoto }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(12);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return portfolioItems;
    return portfolioItems.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, displayLimit);
  }, [filteredItems, displayLimit]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setDisplayLimit(12);
  };

  return (
    <section id="portfolio" className="section_padding">
      <div className="container">
        {/* Section Title */}
        <div className="section_title">
          <span className="subtitle font-modernline">Curated Gallery</span>
          <h2>Koleksi Portofolio</h2>
          <p>
            Pilihan karya fotografi 70 Studio dalam balutan pencahayaan alami & tone sinematik yang abadi.
          </p>
        </div>

        {/* Category Filter Pills (Only Titles, Original Style) */}
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

        {/* Photo Gallery Grid */}
        <div className="gallery_grid">
          {visibleItems.map((item, idx) => (
            <div
              key={item.id}
              className="gallery_item"
              onClick={() => onSelectPhoto(filteredItems, idx)}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                width={item.width}
                height={item.height}
              />
              <div className="gallery_overlay">
                <div className="zoom_icon">
                  <Maximize2 size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredItems.length > displayLimit && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              className="btn_outline"
              onClick={() => setDisplayLimit((prev) => prev + 12)}
            >
              Lihat Foto Lainnya ({filteredItems.length - displayLimit} tersisa)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
