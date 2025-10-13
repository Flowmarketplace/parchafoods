import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const WELCOME_SEEN_KEY = "handcity_welcome_seen";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Temporalmente siempre mostrar
    setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setOpen(false);
  };

  const handleTutorial = () => {
    // Aquí puedes agregar lógica adicional para el tutorial
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-xl p-0 bg-background border-2 border-primary shadow-xl [&>button]:hidden">
        <div className="space-y-3">
          {/* Header */}
          <div className="bg-primary px-4 py-4 relative flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">HandCity</h2>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 rounded-full text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video Container */}
          <div className="px-4">
            <div className="relative rounded-lg overflow-hidden border-2 border-border shadow-lg">
              <video
                className="w-full max-h-[360px] object-contain"
                controls
                autoPlay
                playsInline
                src="/videos/handcity.mp4"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 px-4 pb-4">
            <Button 
              onClick={handleClose} 
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Saltar
            </Button>
            <Button 
              onClick={handleTutorial}
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Ver Tutorial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}