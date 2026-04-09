import { colombiaTeamInfo, colombiaGroup, colombiaMatches } from '@/data/worldcup';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Star, Calendar, MapPin, Users, TrendingUp } from 'lucide-react';

export default function ColombiaProgress() {
  return (
    <div className="space-y-3">
      {/* Hero Card with Colombia colors */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Background with Colombia flag gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FCD116] via-[#003893] to-[#CE1126]" />
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10 p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-4xl sm:text-5xl shrink-0 drop-shadow-lg">🇨🇴</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Selección Colombia
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                DT: {colombiaTeamInfo.coach}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge className="bg-[#FCD116] text-[#003893] border-0 text-[10px] sm:text-xs font-bold gap-1 px-2 py-0.5 hover:bg-[#FCD116]/90">
                  <TrendingUp className="h-3 w-3" />
                  FIFA #{colombiaTeamInfo.fifaRanking}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 text-[10px] sm:text-xs font-semibold gap-1 px-2 py-0.5 backdrop-blur-sm">
                  <Trophy className="h-3 w-3" />
                  {colombiaTeamInfo.bestResult}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 text-[10px] sm:text-xs font-semibold px-2 py-0.5 backdrop-blur-sm">
                  Grupo {colombiaTeamInfo.group}
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Players */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3 w-3 text-[#FCD116]" />
              <span className="text-[10px] sm:text-xs font-semibold text-[#FCD116] uppercase tracking-wider">Figuras Clave</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {colombiaTeamInfo.keyPlayers.map((player) => (
                <span
                  key={player.name}
                  className="text-[9px] sm:text-[10px] bg-white/15 text-white px-2 py-1 rounded-full backdrop-blur-sm font-medium"
                >
                  ⚽ {player.name} · {player.club}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-foreground">
          <div className="w-5 h-5 rounded-md bg-[#003893] flex items-center justify-center">
            <Calendar className="h-3 w-3 text-[#FCD116]" />
          </div>
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
            <div
              key={match.id}
              className="relative overflow-hidden rounded-lg border border-border bg-card"
            >
              {/* Subtle Colombia stripe on left */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FCD116] via-[#003893] to-[#CE1126]" />
              
              <div className="p-2.5 sm:p-3 pl-3.5 sm:pl-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-lg sm:text-xl shrink-0">{match.homeFlag}</span>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate block">{match.homeTeam}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center shrink-0 px-2">
                    <span className="text-[10px] font-black text-[#003893] dark:text-[#FCD116] bg-[#003893]/10 dark:bg-[#FCD116]/10 px-2 py-0.5 rounded-full">VS</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5 font-medium">{match.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                    <div className="min-w-0 text-right">
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate block">{match.awayTeam}</span>
                    </div>
                    <span className="text-lg sm:text-xl shrink-0">{match.awayFlag}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-muted-foreground">
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px]">
                    <Calendar className="h-2.5 w-2.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] truncate">
                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                    {match.venue}, {match.city}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Standing */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-[#003893] to-[#003893]/80 px-3 py-2 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-[#FCD116]" />
          <span className="text-xs sm:text-sm font-bold text-white">{colombiaGroup.name} - Posiciones</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-5 px-1.5 text-[9px] font-bold">#</TableHead>
              <TableHead className="px-1.5 text-[9px] font-bold">Equipo</TableHead>
              <TableHead className="text-center px-1 text-[9px] font-bold">PJ</TableHead>
              <TableHead className="text-center px-1 text-[9px] font-bold">G</TableHead>
              <TableHead className="text-center px-1 text-[9px] font-bold">E</TableHead>
              <TableHead className="text-center px-1 text-[9px] font-bold">P</TableHead>
              <TableHead className="text-center px-1 text-[9px] font-bold">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colombiaGroup.standings.map((team, idx) => (
              <TableRow
                key={team.team}
                className={team.team === 'Colombia' ? 'bg-[#FCD116]/15 font-bold' : ''}
              >
                <TableCell className="px-1.5 py-1.5 text-[10px]">{idx + 1}</TableCell>
                <TableCell className="px-1.5 py-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">{team.flag}</span>
                    <span className={`text-[10px] sm:text-xs ${team.team === 'Colombia' ? 'font-bold text-[#003893] dark:text-[#FCD116]' : 'font-medium'}`}>
                      {team.team}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-center px-1 py-1.5 text-[10px]">{team.played}</TableCell>
                <TableCell className="text-center px-1 py-1.5 text-[10px]">{team.won}</TableCell>
                <TableCell className="text-center px-1 py-1.5 text-[10px]">{team.drawn}</TableCell>
                <TableCell className="text-center px-1 py-1.5 text-[10px]">{team.lost}</TableCell>
                <TableCell className="text-center px-1 py-1.5 text-[10px] font-bold">{team.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Info footer */}
      <p className="text-[9px] text-muted-foreground text-center italic">
        {colombiaTeamInfo.worldCupHistory} · {colombiaTeamInfo.qualifyingPosition} · Datos actualizados de FIFA.com
      </p>
    </div>
  );
}
