import { Short } from '@/types/short';
import ShortCard from '@/components/ShortCard';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShortsCarouselProps {
  shorts: Short[];
}

const ShortsCarousel = ({ shorts }: ShortsCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 200;
      const scrollAmount = direction === 'left' ? -(cardWidth + 16) : (cardWidth + 16);
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(prev => {
        if (direction === 'right') return prev < shorts.length - 1 ? prev + 1 : 0;
        return prev > 0 ? prev - 1 : shorts.length - 1;
      });
    }
  }, [shorts.length]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (shorts.length <= 1) return;
    
    intervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setCurrentIndex(0);
        } else {
          scroll('right');
        }
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shorts.length, scroll]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    if (shorts.length <= 1) return;
    intervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setCurrentIndex(0);
        } else {
          scroll('right');
        }
      }
    }, 3000);
  };

  if (shorts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay videos disponibles para esta categoría</p>
      </div>
    );
  }

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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

      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[minmax(45%,1fr)] sm:auto-cols-[minmax(300px,1fr)] gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {shorts.map((short) => (
          <div key={short.id}>
            <ShortCard short={short} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortsCarousel;
