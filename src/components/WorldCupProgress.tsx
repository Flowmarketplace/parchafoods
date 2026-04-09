import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Utensils, Share2, Camera, Target, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoalStats {
  visits: number;
  referrals: number;
  content: number;
}

const GOAL_VALUES = {
  visit: 2,      // 2 goles por visita
  referral: 3,   // 3 goles por referido
  content: 1,    // 1 gol por contenido
};

const LEVELS = [
  { name: 'Hincha Novato', minGoals: 0, icon: '⚽' },
  { name: 'Aficionado', minGoals: 10, icon: '🥉' },
  { name: 'Goleador', minGoals: 25, icon: '🥈' },
  { name: 'Crack del Sabor', minGoals: 50, icon: '🥇' },
  { name: 'Leyenda Mundial', minGoals: 100, icon: '🏆' },
];

export default function WorldCupProgress() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<GoalStats>({ visits: 0, referrals: 0, content: 0 });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUserId(session.user.id);

      // Load loyalty history as visits
      const { data: loyalty } = await supabase
        .from('loyalty_history')
        .select('id')
        .eq('user_id', session.user.id);

      // Load referrals
      const { data: refs } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', session.user.id);

      setStats({
        visits: loyalty?.length || 0,
        referrals: refs?.length || 0,
        content: 0,
      });
    };
    loadStats();
  }, []);

  const totalGoals =
    stats.visits * GOAL_VALUES.visit +
    stats.referrals * GOAL_VALUES.referral +
    stats.content * GOAL_VALUES.content;

  const currentLevel = [...LEVELS].reverse().find(l => totalGoals >= l.minGoals) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel
    ? ((totalGoals - currentLevel.minGoals) / (nextLevel.minGoals - currentLevel.minGoals)) * 100
    : 100;

  const actions = [
    { icon: Utensils, label: 'Visitas', count: stats.visits, goals: stats.visits * GOAL_VALUES.visit, color: 'text-primary' },
    { icon: Share2, label: 'Referidos', count: stats.referrals, goals: stats.referrals * GOAL_VALUES.referral, color: 'text-secondary' },
    { icon: Camera, label: 'Contenido', count: stats.content, goals: stats.content * GOAL_VALUES.content, color: 'text-accent' },
  ];

  return (
    <Card className="overflow-hidden border-primary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-3 sm:p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <h3 className="text-sm sm:text-base font-bold">Mi Avance Mundialista</h3>
          </div>
          <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground text-[10px] sm:text-xs">
            {currentLevel.icon} {currentLevel.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* Goals count */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary">{totalGoals}</span>
            <span className="text-lg">⚽</span>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground">goles acumulados</p>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] sm:text-[11px] text-muted-foreground">
              <span>{currentLevel.icon} {currentLevel.name}</span>
              <span>{nextLevel.icon} {nextLevel.name}</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <p className="text-[10px] text-muted-foreground text-center">
              {nextLevel.minGoals - totalGoals} goles para el siguiente nivel
            </p>
          </div>
        )}

        {/* Action breakdown */}
        <div className="grid grid-cols-3 gap-2">
          {actions.map((a) => (
            <div key={a.label} className="text-center p-2 rounded-lg bg-muted/50 border border-border">
              <a.icon className={`h-4 w-4 mx-auto mb-1 ${a.color}`} />
              <p className="text-lg sm:text-xl font-bold">{a.goals}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">{a.label}</p>
            </div>
          ))}
        </div>

        {/* How to earn */}
        <div className="bg-muted/30 rounded-lg p-2.5 border border-border">
          <p className="text-[10px] sm:text-[11px] font-semibold text-foreground mb-1.5 flex items-center gap-1">
            <Target className="h-3 w-3 text-primary" /> ¿Cómo anotar goles?
          </p>
          <div className="space-y-1 text-[9px] sm:text-[10px] text-muted-foreground">
            <p>⚽ +{GOAL_VALUES.visit} goles por cada visita a un restaurante</p>
            <p>⚽ +{GOAL_VALUES.referral} goles por recomendar la app</p>
            <p>⚽ +{GOAL_VALUES.content} gol por subir contenido a redes</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full gap-1.5 text-xs font-semibold"
          onClick={() => navigate(userId ? '/my-loyalty' : '/auth')}
        >
          {userId ? (
            <>Ver todo mi progreso <ChevronRight className="h-3.5 w-3.5" /></>
          ) : (
            <>Regístrate y acumula goles ⚽ <ChevronRight className="h-3.5 w-3.5" /></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
