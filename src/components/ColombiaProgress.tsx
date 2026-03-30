import { colombiaTeamInfo, colombiaGroup, colombiaMatches } from '@/data/worldcup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Users, Star, Calendar, MapPin, Clock } from 'lucide-react';

export default function ColombiaProgress() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Team Hero */}
      <Card className="overflow-hidden border-accent/30 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-6xl sm:text-7xl">🇨🇴</div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Selección Colombia
              </h3>
              <p className="text-sm text-muted-foreground">
                DT: {colombiaTeamInfo.coach} • Ranking FIFA: #{colombiaTeamInfo.fifaRanking}
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {colombiaTeamInfo.bestResult}
                </Badge>
                <Badge variant="outline">
                  {colombiaTeamInfo.worldCupHistory}
                </Badge>
                <Badge className="bg-accent text-accent-foreground">
                  Grupo {colombiaTeamInfo.group}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Players */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Jugadores Clave
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {colombiaTeamInfo.keyPlayers.map((player) => (
              <div
                key={player.name}
                className="text-center p-2 sm:p-3 rounded-lg bg-muted/50 border"
              >
                <div className="text-2xl mb-1">⚽</div>
                <p className="text-xs sm:text-sm font-semibold leading-tight">{player.name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{player.position}</p>
                <p className="text-[10px] sm:text-xs text-primary font-medium">{player.club}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Colombia's Matches */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Partidos de Colombia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {colombiaMatches.map((match) => {
            const dateObj = new Date(match.date + 'T12:00:00');
            const formattedDate = dateObj.toLocaleDateString('es-CO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            });

            return (
              <div
                key={match.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl sm:text-2xl">{match.homeFlag}</span>
                  <span className="text-xs sm:text-sm font-semibold">{match.homeTeam}</span>
                </div>
                <div className="flex flex-col items-center px-2 sm:px-4">
                  <span className="text-xs font-bold text-muted-foreground">VS</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    <span className="text-[10px]">{match.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-xs sm:text-sm font-semibold">{match.awayTeam}</span>
                  <span className="text-xl sm:text-2xl">{match.awayFlag}</span>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right ml-4">
                  <span className="text-[10px] sm:text-xs text-muted-foreground capitalize">{formattedDate}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" />
                    <span className="text-[10px]">{match.city}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Group Standing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            {colombiaGroup.name} - Tabla de Posiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead className="text-center">PJ</TableHead>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">E</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center hidden sm:table-cell">GF</TableHead>
                <TableHead className="text-center hidden sm:table-cell">GC</TableHead>
                <TableHead className="text-center font-bold">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colombiaGroup.standings.map((team, idx) => (
                <TableRow
                  key={team.team}
                  className={team.team === 'Colombia' ? 'bg-accent/10 font-semibold' : ''}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <span>{team.flag}</span>
                      <span className="text-xs sm:text-sm">{team.team}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{team.played}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.drawn}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">{team.goalsFor}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">{team.goalsAgainst}</TableCell>
                  <TableCell className="text-center font-bold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
