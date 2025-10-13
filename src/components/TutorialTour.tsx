import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Scroll to element when step changes
    const targetElement = document.querySelector(`[data-tour="${step.target}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  }, [currentStep, step.target]);

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
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    
    // Calculate available space
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = windowWidth - rect.right;
    const spaceLeft = rect.left;

    // Determine best position based on available space
    let position: any = {};
    
    if (step.position === "bottom" && spaceBelow > 300) {
      position = {
        top: `${rect.bottom + 20}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: "translateX(-50%)"
      };
    } else if (step.position === "top" && spaceAbove > 300) {
      position = {
        bottom: `${windowHeight - rect.top + 20}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: "translateX(-50%)"
      };
    } else if (spaceBelow > spaceAbove) {
      // Default to below if more space
      position = {
        top: `${rect.bottom + 20}px`,
        left: "50%",
        transform: "translateX(-50%)"
      };
    } else {
      // Default to above if more space there
      position = {
        bottom: `${windowHeight - rect.top + 20}px`,
        left: "50%",
        transform: "translateX(-50%)"
      };
    }

    return position;
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
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Spotlight with box-shadow technique */}
      {spotlight && (
        <div
          className="absolute rounded-lg transition-all duration-300 pointer-events-auto"
          style={{
            top: `${spotlight.top}px`,
            left: `${spotlight.left}px`,
            width: `${spotlight.width}px`,
            height: `${spotlight.height}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
          }}
        />
      )}
      
      {/* Highlighted element border */}
      {spotlight && (
        <div
          className="absolute rounded-lg ring-4 ring-white shadow-2xl transition-all duration-300 z-20 animate-pulse"
          style={{
            top: `${spotlight.top}px`,
            left: `${spotlight.left}px`,
            width: `${spotlight.width}px`,
            height: `${spotlight.height}px`
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-primary/80 backdrop-blur-md text-white rounded-2xl shadow-2xl p-6 max-w-sm animate-fade-in border border-white/20 pointer-events-auto z-30"
        style={getTooltipPosition()}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 rounded-full bg-white text-primary hover:bg-white/90 shadow-lg"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Arrow Indicator */}
        <div className="text-white mb-4 flex justify-center">
          {getArrowIcon()}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-sm text-white/90 leading-relaxed">{step.description}</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-white"
                    : index < currentStep
                    ? "w-2 bg-white/60"
                    : "w-2 bg-white/30"
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
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Saltar
            </Button>
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={nextStep}
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
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
