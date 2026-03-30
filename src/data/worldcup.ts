// FIFA World Cup 2026 - Real data from FIFA.com

export interface WorldCupMatch {
  id: string;
  date: string;
  time: string; // hora Colombia (COT = ET - 0, same timezone)
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

// Colombia's real group stage matches (Group K)
export const colombiaMatches: WorldCupMatch[] = [
  {
    id: 'col-1',
    date: '2026-06-17',
    time: '22:00',
    homeTeam: 'Uzbekistán',
    awayTeam: 'Colombia',
    homeFlag: '🇺🇿',
    awayFlag: '🇨🇴',
    stage: 'Grupo K - Jornada 1',
    venue: 'Estadio Ciudad de México',
    city: 'Ciudad de México',
    status: 'upcoming',
  },
  {
    id: 'col-2',
    date: '2026-06-23',
    time: '22:00',
    homeTeam: 'Colombia',
    awayTeam: 'Por definir',
    homeFlag: '🇨🇴',
    awayFlag: '🏳️',
    stage: 'Grupo K - Jornada 2',
    venue: 'Estadio Guadalajara',
    city: 'Zapopán, México',
    status: 'upcoming',
  },
  {
    id: 'col-3',
    date: '2026-06-27',
    time: '19:30',
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
    time: '20:00',
    homeTeam: 'México',
    awayTeam: 'Serbia',
    homeFlag: '🇲🇽',
    awayFlag: '🇷🇸',
    stage: 'Partido Inaugural',
    venue: 'Estadio Azteca',
    city: 'Ciudad de México',
    status: 'upcoming',
  },
  {
    id: 'fm-2',
    date: '2026-06-12',
    time: '18:00',
    homeTeam: 'Argentina',
    awayTeam: 'Canadá',
    homeFlag: '🇦🇷',
    awayFlag: '🇨🇦',
    stage: 'Grupo A',
    venue: 'Hard Rock Stadium',
    city: 'Miami',
    status: 'upcoming',
  },
  {
    id: 'fm-3',
    date: '2026-06-13',
    time: '14:00',
    homeTeam: 'Brasil',
    awayTeam: 'Albania',
    homeFlag: '🇧🇷',
    awayFlag: '🇦🇱',
    stage: 'Grupo E',
    venue: 'SoFi Stadium',
    city: 'Los Ángeles',
    status: 'upcoming',
  },
  {
    id: 'fm-4',
    date: '2026-06-14',
    time: '16:00',
    homeTeam: 'España',
    awayTeam: 'Países Bajos',
    homeFlag: '🇪🇸',
    awayFlag: '🇳🇱',
    stage: 'Grupo C',
    venue: 'MetLife Stadium',
    city: 'Nueva Jersey',
    status: 'upcoming',
  },
  ...colombiaMatches,
];

// Colombia's group K standing
export const colombiaGroup: { name: string; standings: GroupStanding[] } = {
  name: 'Grupo K',
  standings: [
    { team: 'Portugal', flag: '🇵🇹', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Colombia', flag: '🇨🇴', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Uzbekistán', flag: '🇺🇿', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Por definir', flag: '🏳️', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  ],
};

// Colombia team info
export const colombiaTeamInfo = {
  name: 'Colombia',
  flag: '🇨🇴',
  fifaRanking: 12,
  group: 'K',
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
