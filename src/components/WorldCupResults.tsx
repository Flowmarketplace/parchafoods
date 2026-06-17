import { recentResults, type WorldCupMatch } from '@/data/worldcup';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Trophy } from 'lucide-react';

const ResultCard = ({ match }: { match: WorldCupMatch }) => {
  const dateObj = new Date(match.date + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const homeWin = (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWin = (match.awayScore ?? 0) > (match.homeScore ?? 0);
  const isLive = match.status === 'live';

  return (
    <Card className={`overflow-hidden ${isLive ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}>
      <CardContent className="p-2.5 sm:p-3">
        <div className="flex items-center justify-between mb-1.5">
          <Badge variant="secondary" className="text-[8px] sm:text-[9px] px-1.5 py-0 leading-tight">
            {match.stage}
          </Badge>
          {isLive ? (
            <span className="flex items-center gap-1 text-[9px] font-bold text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              EN VIVO
            </span>
          ) : (
            <span className="text-[9px] font-semibold text-muted-foreground">FT</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 my-1">
          <div className={`flex items-center gap-1.5 flex-1 min-w-0 ${homeWin ? 'font-bold' : ''}`}>
            <span className="text-lg sm:text-xl shrink-0">{match.homeFlag}</span>
            <span className="text-[10px] sm:text-xs truncate">{match.homeTeam}</span>
          </div>
          <span className="text-base sm:text-lg font-extrabold tabular-nums shrink-0 px-1">
            {match.homeScore}
          </span>
          <span className="text-muted-foreground text-xs shrink-0">-</span>
          <span className="text-base sm:text-lg font-extrabold tabular-nums shrink-0 px-1">
            {match.awayScore}
          </span>
          <div className={`flex items-center gap-1.5 flex-1 min-w-0 justify-end ${awayWin ? 'font-bold' : ''}`}>
            <span className="text-[10px] sm:text-xs truncate text-right">{match.awayTeam}</span>
            <span className="text-lg sm:text-xl shrink-0">{match.awayFlag}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          <span className="flex items-center gap-0.5 text-[8px] sm:text-[9px]">
            <Calendar className="h-2.5 w-2.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-0.5 text-[8px] sm:text-[9px] truncate">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            {match.city}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WorldCupResults() {
  const sorted = [...recentResults].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 px-1">
        <Trophy className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] sm:text-xs font-bold text-foreground">Resultados recientes</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sorted.map((m) => (
          <ResultCard key={m.id} match={m} />
        ))}
      </div>
      <p className="text-[9px] text-muted-foreground text-center italic pt-1">
        Datos actualizados · FIFA World Cup 2026
      </p>
    </div>
  );
}
