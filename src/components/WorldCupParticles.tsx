import { useEffect, useState } from 'react';

const EMOJIS = ['⚽', '🏆', '🎉', '🇨🇴', '🥅', '⭐', '🎊'];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  swayAmount: number;
}

const WorldCupParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100,
      size: 14 + Math.random() * 10,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 15,
      swayAmount: 20 + Math.random() * 40,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-world-cup-fall"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--sway': `${p.swayAmount}px`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default WorldCupParticles;
