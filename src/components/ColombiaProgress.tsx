import { colombiaTeamInfo, colombiaGroup, colombiaMatches } from '@/data/worldcup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Star, Calendar, MapPin } from 'lucide-react';

export default function ColombiaProgress() {
  return (
    <div className="space-y-3">
      {/* Team Hero — compact */}
      <Card className="overflow-hidden border-accent/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl shrink-0">🇨🇴</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Selección Colombia
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                DT: {colombiaTeamInfo.coach} · FIFA #{colombiaTeamInfo.fifaRanking}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="secondary" className="text-[9px] gap-0.5 px-1.5 py-0">
                  <Trophy className="h-2.5 w-2.5" />
                  {colombiaTeamInfo.bestResult}
                </Badge>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                  Grupo {colombiaTeamInfo.group}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colombia's Matches */}
      <div className="space-y-2">
        <h4 className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          Partidos de Colombia
        </h4>
        {colombiaMatches.map((match) => {
          const dateObj = new Date(match.date + 'T12:00:00');
          const formattedDate = dateObj.toLocaleDateString('es-CO', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });

          return (
            <Card key={match.id} className="border-accent/20">
              <CardContent className="p-2.5 sm:p-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{match.homeFlag}</span>
                    <span className="text-[11px] sm:text-xs font-semibold truncate">{match.homeTeam}</span>
                  </div>
                  <div className="flex flex-col items-center shrink-0 px-1">
                    <span className="text-[10px] font-bold text-muted-foreground">VS</span>
                    <span className="text-[8px] sm:text-[9px] text-muted-foreground">{match.time}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
                    <span className="text-[11px] sm:text-xs font-semibold truncate text-right">{match.awayTeam}</span>
                    <span className="text-base sm:text-lg shrink-0">{match.awayFlag}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
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
        })}
      </div>

      {/* Group Standing */}
      <Card>
        <CardHeader className="pb-1 px-3 pt-2.5">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-accent" />
            {colombiaGroup.name} - Posiciones
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1.5 pb-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-5 px-1 text-[9px]">#</TableHead>
                <TableHead className="px-1 text-[9px]">Equipo</TableHead>
                <TableHead className="text-center px-1 text-[9px]">PJ</TableHead>
                <TableHead className="text-center px-1 text-[9px]">G</TableHead>
                <TableHead className="text-center px-1 text-[9px]">E</TableHead>
                <TableHead className="text-center px-1 text-[9px]">P</TableHead>
                <TableHead className="text-center px-1 text-[9px] font-bold">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colombiaGroup.standings.map((team, idx) => (
                <TableRow
                  key={team.team}
                  className={team.team === 'Colombia' ? 'bg-accent/10' : ''}
                >
                  <TableCell className="px-1 py-1 text-[10px]">{idx + 1}</TableCell>
                  <TableCell className="px-1 py-1">
                    <span className="flex items-center gap-1">
                      <span className="text-xs">{team.flag}</span>
                      <span className="text-[10px] sm:text-xs font-medium">{team.team}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-center px-1 py-1 text-[10px]">{team.played}</TableCell>
                  <TableCell className="text-center px-1 py-1 text-[10px]">{team.won}</TableCell>
                  <TableCell className="text-center px-1 py-1 text-[10px]">{team.drawn}</TableCell>
                  <TableCell className="text-center px-1 py-1 text-[10px]">{team.lost}</TableCell>
                  <TableCell className="text-center px-1 py-1 text-[10px] font-bold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
