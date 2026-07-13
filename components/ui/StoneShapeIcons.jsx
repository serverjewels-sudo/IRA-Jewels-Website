import React from 'react';

export function StoneShapeIcon({ shapeId, className = "w-6 h-6", ...props }) {
  const normalizedId = shapeId?.toLowerCase().trim() || "";

  const renderShape = () => {
    switch (normalizedId) {
      case 'round':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" opacity="0.6" />
          </>
        );
      case 'princess':
        return (
          <>
            <rect x="5" y="5" width="14" height="14" />
            <rect x="8" y="8" width="8" height="8" opacity="0.6" />
          </>
        );
      case 'oval':
        return (
          <>
            <ellipse cx="12" cy="12" rx="7" ry="10" />
            <ellipse cx="12" cy="12" rx="4" ry="6" opacity="0.6" />
          </>
        );
      case 'cushion':
        return (
          <>
            <rect x="5" y="5" width="14" height="14" rx="4" ry="4" />
            <rect x="8" y="8" width="8" height="8" rx="2" ry="2" opacity="0.6" />
          </>
        );
      case 'emerald':
        return (
          <>
            <polygon points="7,3 17,3 20,6 20,18 17,21 7,21 4,18 4,6" />
            <polygon points="9,6 15,6 17,8 17,16 15,18 9,18 7,16 7,8" opacity="0.6" />
          </>
        );
      case 'pear':
        return (
          <>
            <path d="M12 2 C12 2 6 9 6 14.5 C6 17.5 8.7 20 12 20 C15.3 20 18 17.5 18 14.5 C18 9 12 2 12 2 Z" />
            <path d="M12 5.5 C12 5.5 8.5 10.5 8.5 14 C8.5 15.5 9.8 17 12 17 C14.2 17 15.5 15.5 15.5 14 C15.5 10.5 12 5.5 12 5.5 Z" opacity="0.6" />
          </>
        );
      case 'marquise':
        return (
          <>
            <path d="M12 2 C6.5 7.5 4.5 12 12 22 C19.5 12 17.5 7.5 12 2 Z" />
            <path d="M12 5 C8.5 9.5 7.5 12 12 19 C16.5 12 15.5 9.5 12 5 Z" opacity="0.6" />
          </>
        );
      case 'radiant':
        // A little less elongated than emerald, closer to a square clipped corner
        return (
          <>
            <polygon points="6,4 18,4 20,6 20,18 18,20 6,20 4,18 4,6" />
            <rect x="8" y="8" width="8" height="8" opacity="0.6" />
            <path d="M4,4 L20,20 M4,20 L20,4" opacity="0.4" />
          </>
        );
      case 'asscher':
        return (
          <>
            <polygon points="8,4 16,4 20,8 20,16 16,20 8,20 4,16 4,8" />
            <polygon points="10,6 14,6 18,10 18,14 14,18 10,18 6,14 6,10" opacity="0.6" />
            <rect x="10" y="10" width="4" height="4" opacity="0.4" />
          </>
        );
      case 'heart':
        return (
          <>
            <path d="M12 21 C12 21 4 14 4 8 C4 5 6.5 3 9 3 C10.5 3 11.5 3.5 12 4.5 C12.5 3.5 13.5 3 15 3 C17.5 3 20 5 20 8 C20 14 12 21 12 21 Z" />
            <path d="M12 17 C12 17 6.5 11.5 6.5 7.5 C6.5 5.5 7.5 4.5 9 4.5 C10.5 4.5 11 5 12 6 C13 5 13.5 4.5 15 4.5 C16.5 4.5 17.5 5.5 17.5 7.5 C17.5 11.5 12 17 12 17 Z" opacity="0.6" />
          </>
        );
      case 'trillion':
        return (
          <>
            <path d="M12 3 Q 18 10 21 19 Q 12 21 3 19 Q 6 10 12 3 Z" />
            <path d="M12 7 Q 16 12 17 16 Q 12 17.5 7 16 Q 8 12 12 7 Z" opacity="0.6" />
          </>
        );
      case 'baguette':
        return (
          <>
            <rect x="6" y="3" width="12" height="18" />
            <rect x="8" y="5" width="8" height="14" opacity="0.6" />
          </>
        );
      case 'triangle':
        return (
          <>
            <polygon points="12,3 21,19 3,19" />
            <polygon points="12,7 17,16 7,16" opacity="0.6" />
          </>
        );
      default:
        // Default to a generic gem shape if unrecognised
        return (
          <path d="M12 2 L20 8 L12 22 L4 8 Z" />
        );
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {renderShape()}
    </svg>
  );
}
