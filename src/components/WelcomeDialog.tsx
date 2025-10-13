import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const WELCOME_SEEN_KEY = "handcity_welcome_seen";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-2 border-primary/20 shadow-2xl">
        <div className="relative">
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="bg-gradient-to-b from-primary/10 to-background p-8">
            <h2 className="text-3xl font-bold text-center mb-2">
              ¡Bienvenido a HandCity!
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Descubre todo lo que puedes hacer en nuestra app
            </p>
            
            <div className="relative rounded-lg overflow-hidden shadow-xl border border-border">
              <video
                className="w-full aspect-video"
                controls
                autoPlay
                src="/videos/handcity.mp4"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={handleClose} size="lg" className="px-8">
                Comenzar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
