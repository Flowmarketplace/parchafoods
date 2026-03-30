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
      className={`overflow-hidden transition-all hover:shadow-sm ${
        isColombiaMatch ? 'border-accent ring-1 ring-accent/20' : ''
      }`}
    >
      <CardContent className="p-3">
        <Badge
          variant={isColombiaMatch ? 'default' : 'secondary'}
          className="text-[9px] sm:text-[10px] mb-2 px-1.5 py-0"
        >
          {match.stage}
        </Badge>

        <div className="flex items-center justify-between gap-1 my-2">
          <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl">{match.homeFlag}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight truncate w-full">
              {match.homeTeam}
            </span>
          </div>

          <div className="flex flex-col items-center shrink-0 px-1">
            {match.status === 'finished' ? (
              <span className="text-lg font-bold">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-xs font-bold text-muted-foreground">VS</span>
            )}
            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {match.time}
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl">{match.awayFlag}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight truncate w-full">
              {match.awayTeam}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground justify-center flex-wrap">
          <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px]">
            <Calendar className="h-2.5 w-2.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            {match.city}
          </span>
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
      {sorted.slice(0, 6).map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}
