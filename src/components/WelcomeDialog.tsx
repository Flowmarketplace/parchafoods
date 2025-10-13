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
      <DialogContent className="max-w-xl p-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-xl border-2 border-primary/40 shadow-2xl [&>button]:hidden">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-primary/30 pb-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              HandCity
            </h2>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video Container */}
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/30 shadow-xl">
            <video
              className="w-full max-h-[380px] object-contain"
              controls
              autoPlay
              playsInline
              src="/videos/handcity.mp4"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
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
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Ver Tutorial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}