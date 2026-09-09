import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  const closeMobile = () => setMobileMenuOpen(false);

  const navItemsLeft = [
    { label: 'Home', to: '/' },
    { label: 'Portfolio', to: '/portfolio' }
  ];

  const navItemsRight = [
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' }
  ];

  return (
    <header className={`main_header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav_grid_container">
          {/* Left */}
          <div className="nav_group nav_left">
            <ul className="nav_links">
              {navItemsLeft.map((item) => (
                <li key={item.label}>
                  <NavLink to={item.to} className={({ isActive }) => `nav_link ${isActive ? 'active' : ''}`} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Logo */}
          <div className="nav_group nav_center">
            <Link to="/" className="brand_link">
              <img src="/logo/1.png" alt="70 Studio" className="brand_logo_img" />
            </Link>
          </div>

          {/* Right */}
          <div className="nav_group nav_right">
            <ul className="nav_links">
              {navItemsRight.map((item) => (
                <li key={item.label}>
                  <NavLink to={item.to} className={({ isActive }) => `nav_link ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile toggle */}
          <button className="mobile_toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile_menu">
            {[...navItemsLeft, ...navItemsRight].map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `nav_link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
