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
      <DialogContent className="max-w-xl p-0 bg-background border-2 border-border shadow-xl [&>button]:hidden">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">HandCity</h2>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video Container */}
          <div className="relative rounded-lg overflow-hidden border-2 border-border shadow-lg">
            <video
              className="w-full max-h-[420px] object-contain"
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