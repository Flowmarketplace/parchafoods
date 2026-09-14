import { useState } from 'react';
import { Building2, Check, ChevronDown, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useCity } from '@/contexts/CityContext';

interface CitySelectorProps {
  compact?: boolean;
  className?: string;
}

const CitySelector = ({ compact = false, className }: CitySelectorProps) => {
  const { city, cities, setCityId, locating, detectCity } = useCity();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('gap-1.5 h-9 px-2.5 max-w-[11rem]', className)}
          aria-label="Cambiar de ciudad"
        >
          <Building2 className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-xs sm:text-sm font-medium">
            {compact ? city.name : city.label}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-2" align="start">
        <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Escoge tu ciudad
        </p>
        <div className="space-y-1">
          {cities.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCityId(c.id);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                c.id === city.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted',
              )}
            >
              <Check className={cn('h-4 w-4', c.id === city.id ? 'opacity-100' : 'opacity-0')} />
              <span className="flex flex-col leading-tight">
                <span>{c.name}</span>
                <span className="text-[11px] text-muted-foreground">{c.state}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-2 border-t pt-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full gap-2"
            disabled={locating}
            onClick={() => {
              detectCity();
              setOpen(false);
            }}
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            Usar mi ubicación
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelector;
