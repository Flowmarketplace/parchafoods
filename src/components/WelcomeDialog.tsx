import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

const WELCOME_SEEN_KEY = "handcity_welcome_seen";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Temporalmente siempre mostrar el popup
    setOpen(true);
    // const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
    // if (!hasSeenWelcome) {
    //   setOpen(true);
    // }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
        <div className="relative bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-1">
          {/* Close Button */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 z-20 bg-background hover:bg-background/90 rounded-full shadow-lg border-2 border-primary"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="bg-background rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 px-6 py-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                  ¡Bienvenido a HandCity!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Descubre todo lo que Cali tiene para ti
                </p>
              </div>
            </div>
            
            {/* Video Container - Vertical Format */}
            <div className="px-6 py-6 bg-gradient-to-b from-background to-muted/20">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient-to-br from-primary via-secondary to-accent bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-1">
                <div className="bg-background rounded-xl overflow-hidden">
                  <video
                    className="w-full aspect-[9/16] object-cover"
                    controls
                    autoPlay
                    muted
                    playsInline
                    src="/videos/handcity.mp4"
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>
            </div>

            {/* Footer with Button */}
            <div className="px-6 pb-6">
              <Button 
                onClick={handleClose} 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity text-lg font-semibold shadow-lg"
              >
                Comenzar a Explorar
              </Button>
              <button
                onClick={handleClose}
                className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Saltar introducción
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}