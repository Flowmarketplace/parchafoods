import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

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
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background/95 backdrop-blur-xl shadow-2xl border-2 border-primary/30 max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close Button */}
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-20 bg-background/90 hover:bg-background shadow-lg rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Header */}
          <div className="bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 px-6 pt-8 pb-6 text-center relative overflow-hidden border-b-2 border-primary/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg">
                  <Sparkles className="h-7 w-7 text-primary-foreground animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                ¡Bienvenido a HandCity!
              </h2>
              <p className="text-sm text-foreground/70 font-medium">
                Descubre todo lo que Cali tiene para ti
              </p>
            </div>
          </div>
          
          {/* Video Container - Reduced Height */}
          <div className="px-6 py-6 bg-background">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20">
              <video
                className="w-full h-[400px] object-cover"
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

          {/* Footer with Buttons */}
          <div className="px-6 pb-6 bg-background">
            <Button 
              onClick={handleClose} 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity text-base font-semibold shadow-lg h-12"
            >
              Comenzar a Explorar
            </Button>
            <button
              onClick={handleClose}
              className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Saltar introducción
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}