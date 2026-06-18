// FIFA World Cup 2026 - Resultados reales actualizados al 18 de junio de 2026 (FIFA.com, ESPN, BBC, SBS)

export interface WorldCupMatch {
  id: string;
  date: string;
  time: string; // hora ET (Eastern Time)
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

// Colombia's real group stage matches (Group K) — Updated from Sporting News
export const colombiaMatches: WorldCupMatch[] = [
  {
    id: 'col-1',
    date: '2026-06-17',
    time: '9:00 PM',
    homeTeam: 'Uzbekistán',
    awayTeam: 'Colombia',
    homeFlag: '🇺🇿',
    awayFlag: '🇨🇴',
    stage: 'Grupo K - Jornada 1',
    venue: 'Estadio Azteca',
    city: 'Ciudad de México, MEX',
    homeScore: 1,
    awayScore: 3,
    status: 'finished',
  },
  {
    id: 'col-2',
    date: '2026-06-23',
    time: '4:00 PM',
    homeTeam: 'Colombia',
    awayTeam: 'R.D. Congo',
    homeFlag: '🇨🇴',
    awayFlag: '🇨🇩',
    stage: 'Grupo K - Jornada 2',
    venue: 'Estadio Akron',
    city: 'Guadalajara, MEX',
    status: 'upcoming',
  },
  {
    id: 'col-3',
    date: '2026-06-27',
    time: '7:30 PM',
    homeTeam: 'Colombia',
    awayTeam: 'Portugal',
    homeFlag: '🇨🇴',
    awayFlag: '🇵🇹',
    stage: 'Grupo K - Jornada 3',
    venue: 'Hard Rock Stadium',
    city: 'Miami, EE.UU.',
    status: 'upcoming',
  },
];

// Featured upcoming matches (various teams)
export const featuredMatches: WorldCupMatch[] = [
  {
    id: 'fm-1',
    date: '2026-06-11',
    time: '3:00 PM',
    homeTeam: 'México',
    awayTeam: 'Sudáfrica',
    homeFlag: '🇲🇽',
    awayFlag: '🇿🇦',
    stage: 'Partido Inaugural - Grupo A',
    venue: 'Estadio Azteca',
    city: 'Ciudad de México',
    status: 'upcoming',
  },
  {
    id: 'fm-2',
    date: '2026-06-12',
    time: '9:00 PM',
    homeTeam: 'Estados Unidos',
    awayTeam: 'Paraguay',
    homeFlag: '🇺🇸',
    awayFlag: '🇵🇾',
    stage: 'Grupo D',
    venue: 'SoFi Stadium',
    city: 'Los Ángeles',
    status: 'upcoming',
  },
  {
    id: 'fm-3',
    date: '2026-06-13',
    time: '6:00 PM',
    homeTeam: 'Brasil',
    awayTeam: 'Marruecos',
    homeFlag: '🇧🇷',
    awayFlag: '🇲🇦',
    stage: 'Grupo C',
    venue: 'MetLife Stadium',
    city: 'Nueva Jersey',
    status: 'upcoming',
  },
  {
    id: 'fm-4',
    date: '2026-06-14',
    time: '4:00 PM',
    homeTeam: 'Países Bajos',
    awayTeam: 'Japón',
    homeFlag: '🇳🇱',
    awayFlag: '🇯🇵',
    stage: 'Grupo F',
    venue: 'AT&T Stadium',
    city: 'Arlington, TX',
    status: 'upcoming',
  },
  ...colombiaMatches,
];

// Resultados recientes (partidos jugados al 17 jun 2026)
export const recentResults: WorldCupMatch[] = [
  {
    id: 'r-1',
    date: '2026-06-11',
    time: '3:00 PM',
    homeTeam: 'México',
    awayTeam: 'Sudáfrica',
    homeFlag: '🇲🇽',
    awayFlag: '🇿🇦',
    stage: 'Inaugural - Grupo A',
    venue: 'Estadio Azteca',
    city: 'CDMX',
    homeScore: 2,
    awayScore: 0,
    status: 'finished',
  },
  {
    id: 'r-2',
    date: '2026-06-12',
    time: '6:00 PM',
    homeTeam: 'Corea del Sur',
    awayTeam: 'R. Checa',
    homeFlag: '🇰🇷',
    awayFlag: '🇨🇿',
    stage: 'Grupo A',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
  },
  {
    id: 'r-3',
    date: '2026-06-13',
    time: '6:00 PM',
    homeTeam: 'Brasil',
    awayTeam: 'Marruecos',
    homeFlag: '🇧🇷',
    awayFlag: '🇲🇦',
    stage: 'Grupo C',
    venue: 'MetLife Stadium',
    city: 'Nueva Jersey',
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
  },
  {
    id: 'r-4',
    date: '2026-06-15',
    time: '3:00 PM',
    homeTeam: 'España',
    awayTeam: 'Cabo Verde',
    homeFlag: '🇪🇸',
    awayFlag: '🇨🇻',
    stage: 'Grupo H',
    venue: 'Hard Rock Stadium',
    city: 'Miami',
    homeScore: 0,
    awayScore: 0,
    status: 'finished',
  },
  {
    id: 'r-5',
    date: '2026-06-16',
    time: '8:00 PM',
    homeTeam: 'Francia',
    awayTeam: 'Senegal',
    homeFlag: '🇫🇷',
    awayFlag: '🇸🇳',
    stage: 'Grupo I',
    venue: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
  },
  {
    id: 'r-6',
    date: '2026-06-17',
    time: '6:00 PM',
    homeTeam: 'Argentina',
    awayTeam: 'Argelia',
    homeFlag: '🇦🇷',
    awayFlag: '🇩🇿',
    stage: 'Grupo J',
    venue: 'Lincoln Financial Field',
    city: 'Filadelfia',
    homeScore: 3,
    awayScore: 0,
    status: 'finished',
  },
  {
    id: 'r-7',
    date: '2026-06-17',
    time: '3:00 PM',
    homeTeam: 'Irak',
    awayTeam: 'Noruega',
    homeFlag: '🇮🇶',
    awayFlag: '🇳🇴',
    stage: 'Grupo E',
    venue: 'NRG Stadium',
    city: 'Houston',
    homeScore: 1,
    awayScore: 4,
    status: 'finished',
  },
  {
    id: 'r-8',
    date: '2026-06-18',
    time: '12:00 PM',
    homeTeam: 'Portugal',
    awayTeam: 'R.D. Congo',
    homeFlag: '🇵🇹',
    awayFlag: '🇨🇩',
    stage: 'Grupo K - Jornada 1',
    venue: 'BMO Field',
    city: 'Toronto',
    homeScore: 1,
    awayScore: 1,
    status: 'finished',
  },
  {
    id: 'r-9',
    date: '2026-06-18',
    time: '3:00 PM',
    homeTeam: 'Inglaterra',
    awayTeam: 'Croacia',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🇭🇷',
    stage: 'Grupo L',
    venue: 'AT&T Stadium',
    city: 'Arlington, TX',
    homeScore: 4,
    awayScore: 2,
    status: 'finished',
  },
  {
    id: 'r-10',
    date: '2026-06-18',
    time: '6:00 PM',
    homeTeam: 'Ghana',
    awayTeam: 'Panamá',
    homeFlag: '🇬🇭',
    awayFlag: '🇵🇦',
    stage: 'Grupo F',
    venue: 'Gillette Stadium',
    city: 'Boston',
    homeScore: 1,
    awayScore: 0,
    status: 'finished',
  },
  {
    id: 'r-11',
    date: '2026-06-18',
    time: '9:00 PM',
    homeTeam: 'Uzbekistán',
    awayTeam: 'Colombia',
    homeFlag: '🇺🇿',
    awayFlag: '🇨🇴',
    stage: 'Grupo K - Jornada 1',
    venue: 'Estadio Azteca',
    city: 'Ciudad de México',
    homeScore: 1,
    awayScore: 3,
    status: 'finished',
  },
];

// Colombia's group K standing — Updated
export const colombiaGroup: { name: string; standings: GroupStanding[] } = {
  name: 'Grupo K',
  standings: [
    { team: 'Colombia', flag: '🇨🇴', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 3, goalsAgainst: 1, points: 3 },
    { team: 'Portugal', flag: '🇵🇹', played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 1, goalsAgainst: 1, points: 1 },
    { team: 'R.D. Congo', flag: '🇨🇩', played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 1, goalsAgainst: 1, points: 1 },
    { team: 'Uzbekistán', flag: '🇺🇿', played: 1, won: 0, drawn: 0, lost: 1, goalsFor: 1, goalsAgainst: 3, points: 0 },
  ],
};

// Colombia team info — Updated April 2026
export const colombiaTeamInfo = {
  name: 'Colombia',
  flag: '🇨🇴',
  fifaRanking: 11,
  group: 'K',
  coach: 'Néstor Lorenzo',
  keyPlayers: [
    { name: 'Luis Díaz', position: 'Extremo', club: 'Liverpool' },
    { name: 'James Rodríguez', position: 'Mediocampista', club: 'León' },
    { name: 'Jhon Durán', position: 'Delantero', club: 'Aston Villa' },
    { name: 'Richard Ríos', position: 'Mediocampista', club: 'Palmeiras' },
    { name: 'Davinson Sánchez', position: 'Defensa', club: 'Galatasaray' },
    { name: 'Jhon Arias', position: 'Extremo', club: 'Zenit' },
  ],
  worldCupHistory: '7ª participación mundialista',
  bestResult: 'Cuartos de Final (2014)',
  qualifyingPosition: '4° en Eliminatorias CONMEBOL',
};
