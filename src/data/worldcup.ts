// FIFA World Cup 2026 - Data updated from FIFA.com & Sporting News (April 2026)

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
    time: '10:00 PM',
    homeTeam: 'Uzbekistán',
    awayTeam: 'Colombia',
    homeFlag: '🇺🇿',
    awayFlag: '🇨🇴',
    stage: 'Grupo K - Jornada 1',
    venue: 'Estadio Azteca',
    city: 'Ciudad de México, MEX',
    status: 'upcoming',
  },
  {
    id: 'col-2',
    date: '2026-06-23',
    time: '10:00 PM',
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

// Colombia's group K standing — Updated
export const colombiaGroup: { name: string; standings: GroupStanding[] } = {
  name: 'Grupo K',
  standings: [
    { team: 'Portugal', flag: '🇵🇹', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Colombia', flag: '🇨🇴', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'R.D. Congo', flag: '🇨🇩', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    { team: 'Uzbekistán', flag: '🇺🇿', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
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
