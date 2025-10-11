import { useState } from 'react';
import { Calendar, MapPin, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DayRecommendation {
  day: string;
  dayShort: string;
  videoUrl: string;
  title: string;
  description: string;
  places: string[];
  events: string[];
}

const weeklyRecommendations: DayRecommendation[] = [
  {
    day: 'Lunes',
    dayShort: 'L',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Empieza la semana con energía',
    description: 'Los mejores lugares para café y desayuno para comenzar tu semana',
    places: ['Café del Parque', 'La Molienda', 'Pan y Café'],
    events: ['Yoga matutino en el parque'],
  },
  {
    day: 'Martes',
    dayShort: 'M',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Martes de cultura',
    description: 'Visita museos y galerías con descuentos especiales',
    places: ['Museo La Tertulia', 'Teatro Jorge Isaacs', 'Galería Arte Libre'],
    events: ['Cine club', 'Exposición de arte contemporáneo'],
  },
  {
    day: 'Miércoles',
    dayShort: 'X',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Mitad de semana gastronómica',
    description: 'Degusta la mejor gastronomía caleña',
    places: ['Restaurante El Patio', 'La Comitiva', 'Ringlete'],
    events: ['Festival gastronómico', 'Noche de tapas'],
  },
  {
    day: 'Jueves',
    dayShort: 'J',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Juernes: Pre-fin de semana',
    description: 'Prepárate para el fin de semana con música en vivo',
    places: ['Tin Tin Deo', 'Zaperoco', 'La Topa Tolondra'],
    events: ['Salsa en vivo', 'Jazz night', 'Happy hour'],
  },
  {
    day: 'Viernes',
    dayShort: 'V',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: '¡Por fin viernes!',
    description: 'La mejor rumba y vida nocturna de Cali',
    places: ['Zaperoco', 'La Topa Tolondra', 'Tin Tin Deo'],
    events: ['Concierto al aire libre', 'Fiesta de salsa', 'DJ Set'],
  },
  {
    day: 'Sábado',
    dayShort: 'S',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Sábado de aventura',
    description: 'Explora la ciudad y sus alrededores',
    places: ['Cristo Rey', 'Río Pance', 'Cerro de las Tres Cruces'],
    events: ['Mercado del Río', 'Ciclovía', 'Tour gastronómico'],
  },
  {
    day: 'Domingo',
    dayShort: 'D',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Domingo en familia',
    description: 'Planes para disfrutar en familia y relajarse',
    places: ['Parque del Perro', 'Zoológico de Cali', 'Parque de las Banderas'],
    events: ['Brunch dominical', 'Cine en el parque', 'Mercado artesanal'],
  },
];

export const WeeklyRecommendations = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const currentRecommendation = weeklyRecommendations[selectedDay];

  return (
    <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-purple-500/10 -mx-4 sm:-mx-4 md:-mx-6 px-4 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10 rounded-lg border-t-2 border-primary/20">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nuestros Recomendados
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Descubre qué hacer cada día de la semana
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-card rounded-lg overflow-hidden shadow-lg border mb-4">
        <div className="relative aspect-video w-full">
          <iframe
            src={currentRecommendation.videoUrl}
            title={currentRecommendation.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Caption */}
        <div className="p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            {currentRecommendation.title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {currentRecommendation.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Places */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Lugares recomendados</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {currentRecommendation.places.map((place, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{place}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Events */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Music className="h-4 w-4 text-secondary" />
                <span>Eventos destacados</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {currentRecommendation.events.map((event, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Days of the Week Selector */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {weeklyRecommendations.map((day, index) => (
          <Button
            key={day.day}
            onClick={() => setSelectedDay(index)}
            variant={selectedDay === index ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'flex-1 sm:flex-none min-w-[40px] sm:min-w-[60px] transition-all',
              selectedDay === index && 'shadow-lg scale-105'
            )}
          >
            <span className="hidden sm:inline">{day.day}</span>
            <span className="sm:hidden font-bold">{day.dayShort}</span>
          </Button>
        ))}
      </div>
    </section>
  );
};
