import { useEffect, useState } from 'react';
import { Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCity } from '@/contexts/CityContext';

const CityWelcomeDialog = () => {
  const { cities, setCityId, hasChosen, detectCity, locating, locationError } = useCity();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasChosen) setOpen(true);
  }, [hasChosen]);

  useEffect(() => {
    if (hasChosen) setOpen(false);
  }, [hasChosen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader className="items-center text-center">
          <img src="/ciudad-logo.png" alt="La Ciudad en tus Manos" className="h-20 w-20 object-contain" />
          <DialogTitle className="text-xl">¿En qué ciudad estás?</DialogTitle>
          <DialogDescription>
            Te mostramos los negocios, eventos y promociones de la ciudad que escojas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {cities.map((c) => (
            <Button
              key={c.id}
              variant="outline"
              className="w-full justify-start h-auto py-3"
              onClick={() => {
                setCityId(c.id);
                setOpen(false);
              }}
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="font-semibold">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.state}</span>
              </span>
            </Button>
          ))}
        </div>

        <Button className="w-full gap-2" disabled={locating} onClick={detectCity}>
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          Usar mi ubicación
        </Button>
        {locationError && <p className="text-xs text-destructive text-center">{locationError}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default CityWelcomeDialog;
