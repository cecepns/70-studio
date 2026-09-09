import React from 'react';
import { Link } from 'react-router-dom';
import { STUDIO_INFO, CATEGORIES } from '../data/studioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer_section">
      <div className="container">
        <div className="footer_grid">
          {/* Brand */}
          <div className="footer_brand">
            <Link to="/">
              <img src="/logo/2.png" alt="70 Studio" style={{ height: '56px', width: 'auto', marginBottom: '20px' }} />
            </Link>
            <p>Studio foto profesional di Duren Sawit, Jakarta Timur.</p>
          </div>

          {/* Nav */}
          <div className="footer_col">
            <h4 className="font-bangla">Navigasi</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer_col">
            <h4 className="font-bangla">Kategori</h4>
            <ul>
              {CATEGORIES.filter((c) => c.id !== 'all').slice(0, 6).map((cat) => (
                <li key={cat.id}><Link to="/portfolio">{cat.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer_col">
            <h4 className="font-bangla">Kontak</h4>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '12px', lineHeight: '1.6' }}>
              {STUDIO_INFO.address}
            </p>
            <ul>
              <li>
                <a href={STUDIO_INFO.getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  {STUDIO_INFO.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${STUDIO_INFO.email}`}>{STUDIO_INFO.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer_bottom">
          <p>© {currentYear} 70 Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
