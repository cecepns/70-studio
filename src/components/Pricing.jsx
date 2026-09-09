import React from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { PACKAGES, STUDIO_INFO } from '../data/studioData';

export default function Pricing() {
  return (
    <section id="pricing" className="section_padding">
      <div className="container">
        <div className="section_title">
          <span className="subtitle font-modernline">Packages & Rates</span>
          <h2>Pilihan Paket Pemotretan</h2>
          <p>
            Investasi transparan untuk hasil foto studio berkualitas tinggi tanpa biaya tersembunyi.
          </p>
        </div>

        <div className="pricing_grid">
          {PACKAGES.map((pkg) => {
            const bookingMsg = `Halo 70 Studio, saya ingin booking paket "${pkg.name}" (${pkg.price}). Apakah slot jadwal masih tersedia?`;
            return (
              <div
                key={pkg.id}
                className={`pricing_card ${pkg.featured ? 'featured' : ''}`}
              >
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '6px' }}>
                  {pkg.category}
                </span>

                <h3 className="font-bangla">{pkg.name}</h3>

                <div className="price_tag font-bangla">
                  {pkg.price}
                  <span className="unit">{pkg.unit}</span>
                </div>

                <ul className="pricing_features">
                  {pkg.features.map((feat, i) => (
                    <li key={i}>
                      <Check size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={STUDIO_INFO.getWhatsAppUrl(bookingMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pkg.featured ? 'btn_primary' : 'btn_outline'}
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  <MessageCircle size={16} />
                  <span>Pilih & Booking WA</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
