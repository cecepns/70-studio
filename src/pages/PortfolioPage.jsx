import React, { useState, useEffect, useMemo } from 'react';
import { Maximize2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES, portfolioItems as DEFAULT_PORTFOLIOS } from '../data/studioData';
import Banner from '../components/Banner';
import Lightbox from '../components/Lightbox';
import SEO from '../components/SEO';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { getImageUrl } from '../utils/request';

export default function PortfolioPage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [portfolioList, setPortfolioList] = useState(DEFAULT_PORTFOLIOS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(16);
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch categories & portfolios from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, portRes] = await Promise.all([
          api.get(API_ENDPOINTS.CATEGORIES.LIST),
          api.get(API_ENDPOINTS.PORTFOLIOS.LIST, { params: { limit: 250 } }),
        ]);

        if (isMounted) {
          if (catRes.data?.success && catRes.data.data?.length > 0) {
            const apiCats = [
              { id: 'all', name: 'All', label: 'Semua' },
              ...catRes.data.data.map((c) => ({
                id: c.slug || c.name.toLowerCase(),
                name: c.name,
                label: c.label || c.name,
                cover: getImageUrl(c.cover_image),
                desc: c.description,
              })),
            ];
            setCategories(apiCats);
          }

          if (portRes.data?.success && portRes.data.data?.length > 0) {
            const apiPorts = portRes.data.data.map((p) => ({
              id: p.id,
              title: p.title,
              category: p.category_slug || (p.category_name || '').toLowerCase(),
              src: getImageUrl(p.image_url),
              width: p.width || 1600,
              height: p.height || 1200,
              aspectRatio: p.aspect_ratio || 1.333,
            }));
            setPortfolioList(apiPorts);
          }
        }
      } catch (err) {
        // Use static fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return portfolioList;
    return portfolioList.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, portfolioList]);

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

      {/* Swipeable / Slideable Banner */}
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

          {/* Interactive Category Filter Pills */}
          <div className="portfolio_filter_bar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter_pill ${activeCategory.toLowerCase() === cat.id.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && portfolioList.length === 0 && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          )}

          {/* Gallery Grid */}
          <div className="gallery_grid">
            {visibleItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="gallery_item"
                onClick={() => setLightbox({ open: true, items: filteredItems, index: idx })}
              >
                <img src={item.src} alt={item.title || 'Portofolio 70 Studio'} loading="lazy" />
                <div className="gallery_overlay">
                  <div className="zoom_icon">
                    <Maximize2 size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && visibleItems.length === 0 && (
            <div className="text-center py-16 text-neutral-400">
              <ImageIcon className="mx-auto mb-3 opacity-40" size={48} />
              <p className="text-lg">Belum ada foto dalam kategori ini.</p>
            </div>
          )}

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
