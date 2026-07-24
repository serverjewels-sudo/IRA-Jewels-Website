"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopCarousel({ title, subtitle, items, filterKey, directLink = false }) {
  const [visibleItems, setVisibleItems] = useState(4);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const containerRef = useRef(null);

  // Responsive items count
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1.5); // Peek next item on mobile
      } else if (window.innerWidth < 768) {
        setVisibleItems(2);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };
    
    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const cloneCount = Math.ceil(visibleItems);
  
  // We initialize currentIndex to cloneCount to point to the first REAL item
  const [currentIndex, setCurrentIndex] = useState(cloneCount);
  
  // If visibleItems changes significantly (e.g. window resize), reset the index safely
  useEffect(() => {
    setCurrentIndex(cloneCount);
  }, [cloneCount]);

  // Re-enable transitions after an instant reposition
  useEffect(() => {
    if (!isTransitioning) {
      // Force a reflow so the browser applies the position change instantly
      if (containerRef.current) {
        // eslint-disable-next-line no-unused-expressions
        containerRef.current.offsetHeight; 
      }
      
      // Use requestAnimationFrame to re-enable transitions smoothly before the next frame
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  if (!items || items.length === 0) return null;

  // Generate clones robustly even if items.length < cloneCount
  const clonesAtStart = [];
  for (let i = 0; i < cloneCount; i++) {
    const index = (items.length - cloneCount + i) % items.length;
    clonesAtStart.push(items[index < 0 ? index + items.length : index]);
  }
  
  const clonesAtEnd = [];
  for (let i = 0; i < cloneCount; i++) {
    clonesAtEnd.push(items[i % items.length]);
  }

  // Create the extended array with clones at both ends
  const extendedItems = [...clonesAtStart, ...items, ...clonesAtEnd];

  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    // Forward wrap: Reached the cloned start items at the end
    if (currentIndex >= items.length + cloneCount) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - items.length);
    }
    // Backward wrap: Reached the cloned end items at the start
    else if (currentIndex <= cloneCount - 1) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + items.length);
    }
  };


  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    
    if (distance > minSwipeDistance) {
      handleNext(); // swipe left
    }
    if (distance < -minSwipeDistance) {
      handlePrev(); // swipe right
    }
  };

  // Calculate percentage width of one item relative to the visible window
  const itemWidthPercent = 100 / (Math.floor(visibleItems) === 1 ? 1 : visibleItems);

  return (
    <section className="w-full bg-[#FFFFFF] pt-10 pb-16 px-6 sm:px-8 lg:px-12 md:pt-12 md:pb-20 border-t border-[#F3F1EC]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          {subtitle && (
            <span className="font-inter font-medium text-[11px] tracking-[2.5px] uppercase text-[#CDB38B] mb-3">
              {subtitle}
            </span>
          )}
          <h2 className="font-cormorant font-normal text-[32px] sm:text-[38px] text-[#2E3135] tracking-wide leading-tight">
            {title}
          </h2>
        </div>

        {/* Carousel */}
        <div className="w-full relative">
          
          {/* Desktop Left Arrow */}
          <button
            onClick={handlePrev}
            className="hidden lg:flex absolute -left-10 xl:-left-12 top-0 bottom-[40px] z-10 items-center justify-center text-[#2E3135] hover:text-[#CDB38B] transition-colors cursor-pointer opacity-70 hover:opacity-100"
            aria-label="Previous items"
          >
            <ChevronLeft className="w-9 h-9" strokeWidth={1.2} />
          </button>

          {/* Carousel Track Container */}
          <div 
            className="w-full overflow-hidden min-w-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              ref={containerRef}
              onTransitionEnd={handleTransitionEnd}
              className={`flex -mx-4 ${isTransitioning ? 'transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
              style={{ 
                transform: `translateX(-${currentIndex * itemWidthPercent}%)` 
              }}
            >
              {extendedItems.map((item, idx) => (
                <div 
                  key={`${item.slug}-${idx}`} 
                  className="shrink-0 px-4"
                  style={{ width: `${itemWidthPercent}%` }}
                >
                  <Link href={directLink ? `/shop/${item.slug}` : `/shop?${filterKey}=${item.slug}`} className="group block h-full">
                    <div className="aspect-square w-full overflow-hidden bg-[#F9F8F6] mb-5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-inter font-medium text-[13px] tracking-wider uppercase text-[#2E3135] group-hover:text-[#CDB38B] transition-colors">
                        {item.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Right Arrow */}
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute -right-10 xl:-right-12 top-0 bottom-[40px] z-10 items-center justify-center text-[#2E3135] hover:text-[#CDB38B] transition-colors cursor-pointer opacity-70 hover:opacity-100"
            aria-label="Next items"
          >
            <ChevronRight className="w-9 h-9" strokeWidth={1.2} />
          </button>
        </div>

      </div>
    </section>
  );
}
