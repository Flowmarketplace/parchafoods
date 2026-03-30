import { featuredMatches, type WorldCupMatch } from '@/data/worldcup';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';

const MatchCard = ({ match }: { match: WorldCupMatch }) => {
  const dateObj = new Date(match.date + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const isColombiaMatch =
    match.homeTeam === 'Colombia' || match.awayTeam === 'Colombia';

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${
        isColombiaMatch ? 'border-accent ring-1 ring-accent/30' : ''
      }`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant={isColombiaMatch ? 'default' : 'secondary'}
            className="text-[10px] sm:text-xs"
          >
            {match.stage}
          </Badge>
          {isColombiaMatch && (
            <span className="text-xs font-bold text-accent">🇨🇴 ¡Nuestra tricolor!</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 my-3">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-2xl sm:text-3xl">{match.homeFlag}</span>
            <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
              {match.homeTeam}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 px-2">
            {match.status === 'finished' ? (
              <span className="text-xl sm:text-2xl font-bold">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-sm sm:text-base font-bold text-muted-foreground">
                VS
              </span>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] sm:text-xs">{match.time}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-2xl sm:text-3xl">{match.awayFlag}</span>
            <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
              {match.awayTeam}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground justify-center">
          <MapPin className="h-3 w-3" />
          <span className="text-[10px] sm:text-xs">
            {match.venue}, {match.city}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground justify-center mt-1">
          <Calendar className="h-3 w-3" />
          <span className="text-[10px] sm:text-xs">{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WorldCupCalendar() {
  const sorted = [...featuredMatches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {sorted.slice(0, 6).map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}
