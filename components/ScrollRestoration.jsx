'use client'

import { useEffect } from 'react'

export default function ScrollRestoration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleWheel = (e) => {
      if (document.activeElement && document.activeElement.type === 'number' && e.target === document.activeElement) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      }
    };

    const handleTouchMove = () => {
      if (document.activeElement && document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return null;
}
