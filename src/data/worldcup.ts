// FIFA World Cup 2026 - Data for El Mundial del Sabor

export interface WorldCupMatch {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  stage: string;
  venue: string;
  city: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
}

export interface GroupStanding {
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

// Colombia's group and key matches
export const colombiaMatches: WorldCupMatch[] = [
  {
    id: 'col-1',
    date: '2026-06-12',
    time: '18:00',
    homeTeam: 'Colombia',
    awayTeam: 'Senegal',
    homeFlag: '🇨🇴',
    awayFlag: '🇸🇳',
    stage: 'Fase de Grupos - Jornada 1',
    venue: 'MetLife Stadium',
    city: 'Nueva Jersey',
    status: 'upcoming',
  },
  {
    id: 'col-2',
    date: '2026-06-17',
    time: '15:00',
    homeTeam: 'Colombia',
    awayTeam: 'Japón',
    homeFlag: '🇨🇴',
    awayFlag: '🇯🇵',
    stage: 'Fase de Grupos - Jornada 2',
    venue: 'Hard Rock Stadium',
    city: 'Miami',
    status: 'upcoming',
  },
  {
    id: 'col-3',
    date: '2026-06-22',
    time: '21:00',
    homeTeam: 'Ecuador',
    awayTeam: 'Colombia',
    homeFlag: '🇪🇨',
    awayFlag: '🇨🇴',
    stage: 'Fase de Grupos - Jornada 3',
    venue: 'AT&T Stadium',
    city: 'Dallas',
    status: 'upcoming',
  },
];

// Featured upcoming matches (various teams)
export const featuredMatches: WorldCupMatch[] = [
  {
    id: 'fm-1',
    date: '2026-06-11',
    time: '17:00',
    homeTeam: 'México',
    awayTeam: 'Canadá',
    homeFlag: '🇲🇽',
    awayFlag: '🇨🇦',
    stage: 'Partido Inaugural',
    venue: 'Estadio Azteca',
    city: 'Ciudad de México',
    status: 'upcoming',
  },
  {
    id: 'fm-2',
    date: '2026-06-11',
    time: '20:00',
    homeTeam: 'Estados Unidos',
    awayTeam: 'Argentina',
    homeFlag: '🇺🇸',
    awayFlag: '🇦🇷',
    stage: 'Fase de Grupos',
    venue: 'SoFi Stadium',
    city: 'Los Ángeles',
    status: 'upcoming',
  },
  {
    id: 'fm-3',
    date: '2026-06-12',
    time: '14:00',
    homeTeam: 'Brasil',
    awayTeam: 'Nigeria',
    homeFlag: '🇧🇷',
    awayFlag: '🇳🇬',
    stage: 'Fase de Grupos',
    venue: 'Rose Bowl',
    city: 'Pasadena',
    status: 'upcoming',
  },
  {
    id: 'fm-4',
    date: '2026-06-13',
    time: '16:00',
    homeTeam: 'España',
    awayTeam: 'Alemania',
    homeFlag: '🇪🇸',
    awayFlag: '🇩🇪',
    stage: 'Fase de Grupos',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    status: 'upcoming',
  },
  ...colombiaMatches,
];

// Colombia's group standing
export const colombiaGroup: { name: string; standings: GroupStanding[] } = {
  name: 'Grupo H',
  standings: [
    { team: 'Colombia', flag: '🇨🇴', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Ecuador', flag: '🇪🇨', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Senegal', flag: '🇸🇳', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Japón', flag: '🇯🇵', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
};

// Colombia team info
export const colombiaTeamInfo = {
  name: 'Colombia',
  flag: '🇨🇴',
  fifaRanking: 12,
  group: 'H',
  coach: 'Néstor Lorenzo',
  keyPlayers: [
    { name: 'Luis Díaz', position: 'Delantero', club: 'Liverpool' },
    { name: 'James Rodríguez', position: 'Mediocampista', club: 'León' },
    { name: 'Jhon Durán', position: 'Delantero', club: 'Aston Villa' },
    { name: 'Richard Ríos', position: 'Mediocampista', club: 'Palmeiras' },
    { name: 'Davinson Sánchez', position: 'Defensa', club: 'Galatasaray' },
  ],
  worldCupHistory: '7ª participación mundialista',
  bestResult: 'Cuartos de Final (2014)',
};
