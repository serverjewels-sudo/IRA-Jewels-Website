import React from 'react';

export function StoneShapeIcon({ shapeId, className = "w-6 h-6", strokeWidth = 1, ...props }) {
  const normalizedId = shapeId?.toLowerCase().trim() || "";

  const renderShape = () => {
    switch (normalizedId) {
      case 'round':
        return (
          <>
            <circle cx="12" cy="12" r="10" fill="none" />
            <polygon points="10,7 14,7 17,10 17,14 14,17 10,17 7,14 7,10" fill="none" />
            <path d="M12,2 L10,7 L4.9,4.9 L7,10 L2,12 L7,14 L4.9,19.1 L10,17 L12,22 L14,17 L19.1,19.1 L17,14 L22,12 L17,10 L19.1,4.9 L14,7 Z" fill="none" />
            <path d="M12,2 L14,7 M4.9,4.9 L10,7 M2,12 L7,10 M4.9,19.1 L7,14 M12,22 L10,17 M19.1,19.1 L14,17 M22,12 L17,14 M19.1,4.9 L17,10" fill="none" />
          </>
        );
      case 'princess':
        return (
          <>
            <rect x="3" y="3" width="18" height="18" fill="none" />
            <rect x="7" y="7" width="10" height="10" fill="none" />
            <path d="M3,3 L7,7 M21,3 L17,7 M21,21 L17,17 M3,21 L7,17" fill="none" />
            <path d="M12,3 L12,7 M12,21 L12,17 M3,12 L7,12 M21,12 L17,12" fill="none" />
            <path d="M7,7 L17,17 M7,17 L17,7" fill="none" />
          </>
        );
      case 'cushion':
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="4" fill="none" />
            <rect x="7" y="7" width="10" height="10" rx="2" fill="none" />
            <path d="M4.5,4.5 L7,7 M19.5,4.5 L17,7 M19.5,19.5 L17,17 M4.5,19.5 L7,17" fill="none" />
            <path d="M12,3 L12,7 M12,21 L12,17 M3,12 L7,12 M21,12 L17,12" fill="none" />
            <path d="M7,7 L17,17 M7,17 L17,7" fill="none" />
          </>
        );
      case 'emerald':
        return (
          <>
            <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="none" />
            <polygon points="8,4 16,4 20,8 20,16 16,20 8,20 4,16 4,8" fill="none" />
            <polygon points="9.5,6.5 14.5,6.5 17.5,9.5 17.5,14.5 14.5,17.5 9.5,17.5 6.5,14.5 6.5,9.5" fill="none" />
            <path d="M7,2 L9.5,6.5 M17,2 L14.5,6.5 M22,7 L17.5,9.5 M22,17 L17.5,14.5 M17,22 L14.5,17.5 M7,22 L9.5,17.5 M2,17 L6.5,14.5 M2,7 L6.5,9.5" fill="none" />
          </>
        );
      case 'asscher':
        return (
          <>
            <polygon points="7,3 17,3 21,7 21,17 17,21 7,21 3,17 3,7" fill="none" />
            <polygon points="9,5 15,5 19,9 19,15 15,19 9,19 5,15 5,9" fill="none" />
            <rect x="10.5" y="10.5" width="3" height="3" fill="none" />
            <path d="M7,3 L10.5,10.5 M17,3 L13.5,10.5 M17,21 L13.5,13.5 M7,21 L10.5,13.5" fill="none" />
            <path d="M21,7 L13.5,10.5 M3,7 L10.5,10.5 M21,17 L13.5,13.5 M3,17 L10.5,13.5" fill="none" />
          </>
        );
      case 'radiant':
        return (
          <>
            <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="none" />
            <polygon points="9,5 15,5 18,8 18,16 15,19 9,19 6,16 6,8" fill="none" />
            <path d="M9,5 L15,19 M9,19 L15,5" fill="none" />
            <path d="M7,2 L9,5 M17,2 L15,5 M22,7 L18,8 M22,17 L18,16 M17,22 L15,19 M7,22 L9,19 M2,17 L6,16 M2,7 L6,8" fill="none" />
            <path d="M12,2 L9,5 L2,12 L6,16 L12,22 L15,19 L22,12 L18,8 Z" fill="none" />
          </>
        );
      case 'baguette':
        return (
          <>
            <rect x="5" y="2" width="14" height="20" fill="none" />
            <rect x="8" y="5" width="8" height="14" fill="none" />
            <rect x="10" y="7" width="4" height="10" fill="none" />
            <path d="M5,2 L10,7 M19,2 L14,7 M19,22 L14,17 M5,22 L10,17" fill="none" />
          </>
        );
      case 'oval':
        return (
          <>
            <ellipse cx="12" cy="12" rx="9" ry="11" fill="none" />
            <ellipse cx="12" cy="12" rx="5" ry="7" fill="none" />
            <path d="M12,5 L12,19 M12,5 L7,12 L12,19 L17,12 Z" fill="none" />
            <path d="M12,1 L12,5 M12,23 L12,19 M3,12 L7,12 M21,12 L17,12 M6,5 L9,7.5 M18,5 L15,7.5 M6,19 L9,16.5 M18,19 L15,16.5" fill="none" />
          </>
        );
      case 'pear':
        return (
          <>
            <path d="M12 2 C12 2 4 9 4 15 C4 19.418 7.582 23 12 23 C16.418 23 20 19.418 20 15 C20 9 12 2 12 2 Z" fill="none" />
            <path d="M12 6 C12 6 7 11 7 15 C7 17.761 9.239 20 12 20 C14.761 20 17 17.761 17 15 C17 11 12 6 12 6 Z" fill="none" />
            <path d="M12,6 L12,20 M12,6 L8.5,14 L12,20 L15.5,14 Z" fill="none" />
            <path d="M12,2 L12,6 M12,23 L12,20 M4,15 L7,15 M20,15 L17,15 M6.5,8 L9.5,10 M17.5,8 L14.5,10 M6.5,19.5 L9.5,17.5 M17.5,19.5 L14.5,17.5" fill="none" />
          </>
        );
      case 'marquise':
        return (
          <>
            <path d="M12 2 C5 8 3 13 12 22 C21 13 19 8 12 2 Z" fill="none" />
            <path d="M12 6 C8 10 7 13 12 18 C17 13 16 10 12 6 Z" fill="none" />
            <path d="M12,6 L12,18 M12,6 L8.5,12 L12,18 L15.5,12 Z" fill="none" />
            <path d="M12,2 L12,6 M12,22 L12,18 M3.5,12 L8.5,12 M20.5,12 L15.5,12 M6.5,7 L9.5,9.5 M17.5,7 L14.5,9.5 M6.5,17 L9.5,14.5 M17.5,17 L14.5,14.5" fill="none" />
          </>
        );
      case 'heart':
        return (
          <>
            <path d="M12 22 C12 22 2 13 2 7 C2 3.5 5 2 8 2 C10 2 11.5 3 12 4.5 C12.5 3 14 2 16 2 C19 2 22 3.5 22 7 C22 13 12 22 12 22 Z" fill="none" />
            <path d="M12 18 C12 18 6 11.5 6 7.5 C6 5.5 7.5 4.5 9 4.5 C10.5 4.5 11 5 12 6.5 C13 5 13.5 4.5 15 4.5 C16.5 4.5 18 5.5 18 7.5 C18 11.5 12 18 12 18 Z" fill="none" />
            <path d="M12,6.5 L12,18 M12,6.5 L8,11 L12,18 L16,11 Z" fill="none" />
            <path d="M12,4.5 L12,6.5 M12,22 L12,18 M2,7 L6,7.5 M22,7 L18,7.5 M5,14 L9,13 M19,14 L15,13 M8,2 L9,4.5 M16,2 L15,4.5" fill="none" />
          </>
        );
      case 'trillion':
        return (
          <>
            <path d="M12 2 Q 20 8 22 18 Q 12 21 2 18 Q 4 8 12 2 Z" fill="none" />
            <polygon points="12,6 17,16 7,16" fill="none" />
            <path d="M12,6 L12,16 M12,16 L7,11 M12,16 L17,11" fill="none" />
            <path d="M12,2 L12,6 M22,18 L17,16 M2,18 L7,16 M6.5,7 L9.5,11 M17.5,7 L14.5,11 M12,20.5 L12,16" fill="none" />
          </>
        );
      case 'triangle':
        return (
          <>
            <polygon points="12,2 22,19 2,19" fill="none" />
            <polygon points="12,6 17,16 7,16" fill="none" />
            <path d="M12,6 L12,16 M12,16 L8,11 M12,16 L16,11" fill="none" />
            <path d="M12,2 L12,6 M22,19 L17,16 M2,19 L7,16 M7,7.5 L10,11 M17,7.5 L14,11 M12,19 L12,16" fill="none" />
          </>
        );
      default:
        return (
          <path d="M12 2 L20 8 L12 22 L4 8 Z" fill="none" />
        );
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`fill-none ${className}`}
      {...props}
    >
      {renderShape()}
    </svg>
  );
}
