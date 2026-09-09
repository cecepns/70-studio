import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { STUDIO_INFO } from '../data/studioData';
import Banner from '../components/Banner';
import SEO from '../components/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Hubungi 70 Studio di Jl. Selat Bali, Duren Sawit, Jakarta Timur. WhatsApp 082299963635, Email Studiofoto70@gmail.com. Buka setiap hari 09:00-21:00 WIB."
        path="/contact"
      />

      {/* Banner identical to Home */}
      <Banner
        scrollToId="#contact-content"
        subtitle="Contact — Timeless memories, lovingly captured"
      />

      <section id="contact-content" className="section_padding">
        <div className="container">
          <div className="section_title" style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="subtitle font-modernline" style={{ display: 'block', fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '4px' }}>
              Get In Touch
            </span>
            <h2 className="font-bangla" style={{ fontSize: '2.4rem', color: 'var(--color-dark)' }}>
              Contact & Location
            </h2>
            <p style={{ color: 'var(--color-muted)', maxWidth: '540px', margin: '12px auto 0' }}>
              Kunjungi studio kami di Duren Sawit, Jakarta Timur atau hubungi via WhatsApp untuk reservasi jadwal foto.
            </p>
          </div>

          <div className="contact_grid">
            {/* Contact Info */}
            <div className="contact_info_box">
              <div className="contact_item">
                <div className="contact_icon">
                  <MapPin size={20} />
                </div>
                <div className="contact_text">
                  <h4 className="font-bangla">Alamat Studio</h4>
                  <p>{STUDIO_INFO.address}</p>
                  <a
                    href={STUDIO_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontSize: '0.88rem', fontWeight: 500, marginTop: '6px' }}
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="contact_item">
                <div className="contact_icon">
                  <Phone size={20} />
                </div>
                <div className="contact_text">
                  <h4 className="font-bangla">WhatsApp</h4>
                  <p>{STUDIO_INFO.phoneDisplay}</p>
                </div>
              </div>

              <div className="contact_item">
                <div className="contact_icon">
                  <Mail size={20} />
                </div>
                <div className="contact_text">
                  <h4 className="font-bangla">Email</h4>
                  <p>
                    <a href={`mailto:${STUDIO_INFO.email}`} style={{ color: 'inherit' }}>
                      {STUDIO_INFO.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact_item" style={{ marginBottom: '32px' }}>
                <div className="contact_icon">
                  <Clock size={20} />
                </div>
                <div className="contact_text">
                  <h4 className="font-bangla">Jam Operasional</h4>
                  <p>{STUDIO_INFO.operatingHours}</p>
                </div>
              </div>

              <a
                href={STUDIO_INFO.getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn_whatsapp"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MessageCircle size={18} />
                <span>Chat WhatsApp Sekarang</span>
              </a>
            </div>

            {/* Map */}
            <div className="map_wrapper">
              <iframe
                title="Lokasi 70 Studio Duren Sawit"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2163977312154!2d106.9116773!3d-6.235187!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x2e69f34f71a48695%3A0x8673a6ad031bb990!2sJl.+Selat+Bali%2C+Duren+Sawit%2C+Kota+Jakarta+Timur!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
