import React, { useEffect } from 'react';

/**
 * Sets document title and meta description for SEO on each page.
 * Since this is a client-side SPA, we dynamically update <head> tags.
 */
export default function SEO({ title, description, path }) {
  useEffect(() => {
    const baseTitle = '70 Studio';
    document.title = title ? `${title} | ${baseTitle}` : `${baseTitle} - Professional Photography Studio Jakarta Timur`;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && path) {
      canonical.setAttribute('href', `https://70studio.id${path}`);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && path) ogUrl.setAttribute('content', `https://70studio.id${path}`);

    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [title, description, path]);

  return null;
}
