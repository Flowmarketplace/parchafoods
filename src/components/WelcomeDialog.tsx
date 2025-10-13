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
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-lg p-6 bg-background border-2 border-border shadow-xl">
        <div className="space-y-4">
          {/* Video Container */}
          <div className="relative rounded-lg overflow-hidden border-2 border-border shadow-lg">
            <video
              className="w-full max-h-[500px] object-contain"
              controls
              autoPlay
              playsInline
              src="/videos/handcity.mp4"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleClose} 
              variant="outline"
              className="flex-1"
            >
              Saltar
            </Button>
            <Button 
              onClick={handleTutorial}
              className="flex-1"
            >
              Ver Tutorial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}