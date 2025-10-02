import { Card, CardContent } from '@/components/ui/card';
import { Star, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoyaltyProgressBarProps {
  points: number;
  maxPoints?: number;
  placeName: string;
  compact?: boolean;
}

const LoyaltyProgressBar = ({ 
  points, 
  maxPoints = 5, 
  placeName,
  compact = false 
}: LoyaltyProgressBarProps) => {
  const percentage = Math.min((points / maxPoints) * 100, 100);
  const isComplete = points >= maxPoints;

  return (
    <Card className={cn(
      "overflow-hidden",
      isComplete && "border-secondary bg-gradient-to-br from-secondary/10 to-primary/10"
    )}>
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <Gift className="h-5 w-5 text-secondary" />
            ) : (
              <Star className="h-5 w-5 text-primary" />
            )}
            <span className={cn(
              "font-semibold",
              compact ? "text-sm" : "text-base"
            )}>
              {placeName}
            </span>
          </div>
          <span className={cn(
            "font-bold",
            isComplete ? "text-secondary" : "text-primary",
            compact ? "text-sm" : "text-lg"
          )}>
            {points}/{maxPoints}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-8 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full",
              isComplete 
                ? "bg-gradient-to-r from-secondary to-primary"
                : "bg-gradient-to-r from-primary/80 to-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
          
          {/* Star markers */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {Array.from({ length: maxPoints }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300",
                  index < points
                    ? "bg-background border-primary scale-110"
                    : "bg-muted border-muted-foreground/30"
                )}
              >
                <Star
                  className={cn(
                    "h-3 w-3 transition-all duration-300",
                    index < points
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {isComplete && (
          <p className="text-sm text-center mt-2 text-secondary font-semibold">
            ¡Recompensa disponible! 🎉
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgressBar;
