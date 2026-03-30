import { colombiaTeamInfo, colombiaGroup, colombiaMatches } from '@/data/worldcup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Users, Star, Calendar, MapPin, Clock } from 'lucide-react';

export default function ColombiaProgress() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Team Hero — compact */}
      <Card className="overflow-hidden border-accent/20">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl sm:text-5xl shrink-0">🇨🇴</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Selección Colombia
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                DT: {colombiaTeamInfo.coach} · Ranking FIFA #{colombiaTeamInfo.fifaRanking}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <Badge variant="secondary" className="text-[10px] gap-0.5 px-1.5 py-0">
                  <Trophy className="h-2.5 w-2.5" />
                  {colombiaTeamInfo.bestResult}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Grupo {colombiaTeamInfo.group}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Players — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {colombiaTeamInfo.keyPlayers.map((player) => (
          <div
            key={player.name}
            className="text-center p-2 sm:p-3 rounded-lg bg-card border shrink-0 w-[100px] sm:w-[120px]"
          >
            <div className="text-lg sm:text-xl mb-0.5">⚽</div>
            <p className="text-[11px] sm:text-xs font-semibold leading-tight truncate">{player.name}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">{player.position}</p>
            <p className="text-[9px] sm:text-[10px] text-primary font-medium truncate">{player.club}</p>
          </div>
        ))}
      </div>

      {/* Colombia's Matches — stacked cards */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
          <Calendar className="h-4 w-4 text-primary" />
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
            <Card key={match.id} className="border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  {/* Home */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-lg sm:text-xl shrink-0">{match.homeFlag}</span>
                    <span className="text-xs font-semibold truncate">{match.homeTeam}</span>
                  </div>
                  {/* VS + time */}
                  <div className="flex flex-col items-center shrink-0 px-1">
                    <span className="text-[10px] font-bold text-muted-foreground">VS</span>
                    <span className="text-[9px] text-muted-foreground">{match.time} COT</span>
                  </div>
                  {/* Away */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                    <span className="text-xs font-semibold truncate text-right">{match.awayTeam}</span>
                    <span className="text-lg sm:text-xl shrink-0">{match.awayFlag}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-muted-foreground">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Calendar className="h-2.5 w-2.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] truncate">
                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                    {match.city}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Group Standing — responsive table */}
      <Card>
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Star className="h-4 w-4 text-accent" />
            {colombiaGroup.name} - Posiciones
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-6 px-1 text-[10px]">#</TableHead>
                  <TableHead className="px-1 text-[10px]">Equipo</TableHead>
                  <TableHead className="text-center px-1 text-[10px]">PJ</TableHead>
                  <TableHead className="text-center px-1 text-[10px]">G</TableHead>
                  <TableHead className="text-center px-1 text-[10px]">E</TableHead>
                  <TableHead className="text-center px-1 text-[10px]">P</TableHead>
                  <TableHead className="text-center px-1 text-[10px] font-bold">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colombiaGroup.standings.map((team, idx) => (
                  <TableRow
                    key={team.team}
                    className={team.team === 'Colombia' ? 'bg-accent/10' : ''}
                  >
                    <TableCell className="px-1 py-1.5 text-xs">{idx + 1}</TableCell>
                    <TableCell className="px-1 py-1.5">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">{team.flag}</span>
                        <span className="text-xs font-medium">{team.team}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-1 py-1.5 text-xs">{team.played}</TableCell>
                    <TableCell className="text-center px-1 py-1.5 text-xs">{team.won}</TableCell>
                    <TableCell className="text-center px-1 py-1.5 text-xs">{team.drawn}</TableCell>
                    <TableCell className="text-center px-1 py-1.5 text-xs">{team.lost}</TableCell>
                    <TableCell className="text-center px-1 py-1.5 text-xs font-bold">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
