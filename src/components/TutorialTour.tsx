import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  arrow: "down" | "up" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "navbar-search",
    title: "Buscador",
    description: "Busca lugares, eventos, barrios o tipos de comida. El buscador encuentra todo lo que necesitas en Cali.",
    position: "bottom",
    arrow: "down"
  },
  {
    target: "neighborhood-selector",
    title: "Selector de Barrios",
    description: "Filtra los lugares por barrio para encontrar lo que está más cerca de ti o en la zona que prefieres.",
    position: "bottom",
    arrow: "down"
  },
  {
    target: "category-bar",
    title: "Categorías",
    description: "Explora diferentes categorías: restaurantes, bares, cultura, entretenimiento y más.",
    position: "bottom",
    arrow: "down"
  },
  {
    target: "bottom-nav",
    title: "Navegación Principal",
    description: "Accede rápidamente a Inicio, Cerca de Mí, Favoritos y tu Perfil desde cualquier lugar.",
    position: "top",
    arrow: "up"
  },
  {
    target: "sidebar-trigger",
    title: "Menú Lateral",
    description: "Abre el menú para ver todas las opciones: recomendaciones, eventos, shorts, lealtad y más.",
    position: "right",
    arrow: "right"
  }
];

export function TutorialTour({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getArrowIcon = () => {
    switch (step.arrow) {
      case "down": return <ArrowDown className="h-8 w-8" />;
      case "up": return <ArrowUp className="h-8 w-8" />;
      case "left": return <ArrowLeft className="h-8 w-8" />;
      case "right": return <ArrowRight className="h-8 w-8" />;
    }
  };

  const getTooltipPosition = () => {
    const targetElement = document.querySelector(`[data-tour="${step.target}"]`);
    if (!targetElement) return { top: "50%", left: "50%" };

    const rect = targetElement.getBoundingClientRect();
    
    switch (step.position) {
      case "bottom":
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)"
        };
      case "top":
        return {
          bottom: `${window.innerHeight - rect.top + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translateX(-50%)"
        };
      case "left":
        return {
          top: `${rect.top + rect.height / 2}px`,
          right: `${window.innerWidth - rect.left + 20}px`,
          transform: "translateY(-50%)"
        };
      case "right":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: "translateY(-50%)"
        };
    }
  };

  const getSpotlightPosition = () => {
    const targetElement = document.querySelector(`[data-tour="${step.target}"]`);
    if (!targetElement) return null;

    const rect = targetElement.getBoundingClientRect();
    return {
      top: rect.top - 8,
      left: rect.left - 8,
      width: rect.width + 16,
      height: rect.height + 16
    };
  };

  const spotlight = getSpotlightPosition();

  return (
    <div className="fixed inset-0 z-50">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      {/* Spotlight */}
      {spotlight && (
        <div
          className="absolute rounded-lg border-4 border-white shadow-2xl animate-pulse"
          style={{
            top: `${spotlight.top}px`,
            left: `${spotlight.left}px`,
            width: `${spotlight.width}px`,
            height: `${spotlight.height}px`,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.8)"
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-white rounded-2xl shadow-2xl p-6 max-w-sm animate-fade-in"
        style={getTooltipPosition()}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 rounded-full bg-primary text-white hover:bg-primary/90"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Arrow Indicator */}
        <div className="text-primary mb-3 flex justify-center">
          {getArrowIcon()}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Saltar Tutorial
            </Button>
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={nextStep}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {currentStep === tourSteps.length - 1 ? (
                "Finalizar"
              ) : (
                <>
                  Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
