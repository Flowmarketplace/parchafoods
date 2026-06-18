import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import citySkyline from "@/assets/city-skyline.png";
import { TutorialTour } from "./TutorialTour";

const WELCOME_SEEN_KEY = "mundialdelsabor_welcome_seen";

function safeGetItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage can be blocked in some browsers/iframes
  }
}

export function WelcomeDialog({
  onTourChange,
}: {
  onTourChange?: (isActive: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasSeenWelcome = safeGetItem(WELCOME_SEEN_KEY);
    if (!hasSeenWelcome) setOpen(true);
  }, []);

  const markSeenAndClose = () => {
    if (videoRef.current) videoRef.current.pause();
    safeSetItem(WELCOME_SEEN_KEY, "true");
    setOpen(false);
  };

  const handleTutorial = () => {
    if (videoRef.current) videoRef.current.pause();
    safeSetItem(WELCOME_SEEN_KEY, "true");
    setOpen(false);
    setTimeout(() => {
      setShowTour(true);
      onTourChange?.(true);
    }, 300);
  };

  const handleCloseTour = () => {
    setShowTour(false);
    onTourChange?.(false);
  };

  return (
    <>
      {showTour && <TutorialTour onClose={handleCloseTour} />}

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          // Permite cerrar con ESC o click afuera; al cerrar marcamos como visto.
          if (!nextOpen) {
            markSeenAndClose();
          } else {
            setOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md p-0 bg-background border-2 border-primary rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
          <div className="space-y-3">
            <div className="bg-primary px-4 py-4 relative flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url(${citySkyline})`,
                  backgroundSize: "cover",
                  backgroundPosition: "bottom",
                  backgroundRepeat: "no-repeat",
                  filter: "brightness(0) invert(1)",
                }}
              />
              <h2 className="text-2xl font-bold text-white relative z-10">Parcha Foods</h2>
              <Button
                onClick={markSeenAndClose}
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 rounded-full text-white hover:bg-white/20 z-10"
                aria-label="Cerrar bienvenida"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-border shadow-lg">
                <video
                  ref={videoRef}
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

            <div className="flex gap-3 px-4 pb-4">
              <Button
                onClick={markSeenAndClose}
                variant="outline"
                size="lg"
                className="flex-1 rounded-xl"
              >
                Saltar
              </Button>
              <Button onClick={handleTutorial} size="lg" className="flex-1 rounded-xl">
                Ver Tutorial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
