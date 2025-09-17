import { useEffect } from 'react';

export const useCanonical = (path: string | null) => {
  useEffect(() => {
    if (typeof document === 'undefined' || !path) {
      return;
    }

    const origin = window.location.origin;
    const canonicalUrl = path.startsWith('http') ? path : `${origin}${path}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', canonicalUrl);
  }, [path]);
};
