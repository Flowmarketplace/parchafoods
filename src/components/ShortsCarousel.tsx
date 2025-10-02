import { Short } from '@/types/short';
import ShortCard from '@/components/ShortCard';
import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShortsCarouselProps {
  shorts: Short[];
}

const ShortsCarousel = ({ shorts }: ShortsCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || shorts.length === 0) return;

    // Auto-scroll to the right every 3 seconds
    const interval = setInterval(() => {
      if (scrollContainer) {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;
        
        // If we're at the end, scroll back to start
        if (currentScroll >= maxScroll - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll one card width to the right
          const cardWidth = scrollContainer.firstElementChild?.clientWidth || 200;
          scrollContainer.scrollBy({ left: cardWidth + 16, behavior: 'smooth' }); // +16 for gap
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [shorts.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 200;
      const scrollAmount = direction === 'left' ? -(cardWidth + 16) : (cardWidth + 16);
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (shorts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay videos disponibles para esta categoría</p>
      </div>
    );
  }

  // Split shorts into 2 rows
  const row1 = shorts.filter((_, index) => index % 2 === 0);
  const row2 = shorts.filter((_, index) => index % 2 === 1);

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Carousel Container */}
      <div className="space-y-4">
        {/* Row 1 */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {row1.map((short) => (
            <div key={short.id} className="flex-shrink-0 w-40 sm:w-48">
              <ShortCard short={short} />
            </div>
          ))}
        </div>

        {/* Row 2 */}
        {row2.length > 0 && (
          <div
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {row2.map((short) => (
              <div key={short.id} className="flex-shrink-0 w-40 sm:w-48">
                <ShortCard short={short} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsCarousel;
