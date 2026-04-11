import { motion } from "framer-motion";
import { MapPin, Trophy, Video, QrCode, Star, Bot, Navigation } from "lucide-react";
import featureMapa from "@/assets/feature-mapa.png";
import featureShorts from "@/assets/feature-shorts.png";
import featureLoyalty from "@/assets/feature-loyalty.png";
import featurePromos from "@/assets/feature-promos.png";
import featureAi from "@/assets/feature-ai.png";

const features = [
  {
    icon: MapPin,
    title: "Mapa Interactivo",
    subtitle: "Encuentra lo mejor cerca de ti",
    description: "Localiza restaurantes cercanos con ubicación en tiempo real. Filtra por categoría, barrio o tipo de cocina y descubre nuevos lugares para disfrutar cada partido.",
    image: featureMapa,
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary",
  },
  {
    icon: Trophy,
    title: "Rutas Mundialistas",
    subtitle: "Recorre Cali y gana premios",
    description: "Completa rutas temáticas visitando restaurantes, acumula goles y desbloquea recompensas exclusivas. ¡Convierte cada comida en una aventura mundialista!",
    image: "",
    color: "from-accent/20 to-accent/5",
    iconBg: "bg-accent",
  },
  {
    icon: Video,
    title: "Videos & Shorts",
    subtitle: "Mira antes de ir",
    description: "Explora videos cortos de los restaurantes: sus platos estrella, el ambiente, ofertas especiales y lo que los hace únicos. Todo en formato rápido y visual.",
    image: featureShorts,
    color: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary",
  },
  {
    icon: QrCode,
    title: "Programa de Lealtad",
    subtitle: "Escanea, acumula y gana",
    description: "Escanea códigos QR en cada visita, acumula puntos automáticamente y reclama recompensas exclusivas como descuentos, platos gratis y experiencias VIP.",
    image: featureLoyalty,
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary",
  },
  {
    icon: Star,
    title: "Promociones Exclusivas",
    subtitle: "Ofertas solo en la app",
    description: "Accede a descuentos especiales, combos mundialistas y ofertas exclusivas que solo están disponibles para usuarios de El Mundial del Sabor.",
    image: featurePromos,
    color: "from-accent/20 to-accent/5",
    iconBg: "bg-accent",
  },
  {
    icon: Bot,
    title: "Asistente con IA",
    subtitle: "Tu guía gastronómica personal",
    description: "Pregúntale a nuestro asistente inteligente dónde comer según tu antojo, qué pedir en cada restaurante y dónde ver el próximo partido.",
    image: featureAi,
    color: "from-secondary/20 to-secondary/5",
    iconBg: "bg-secondary",
  },
];

const PhoneMockup = ({ image, title, scrolling }: { image: string; title: string; scrolling?: boolean }) => (
  <div className="relative mx-auto w-[260px] md:w-[280px] lg:w-[300px]">
    {/* Phone frame */}
    <div className="relative rounded-[2.5rem] border-[6px] border-foreground/80 bg-foreground/90 shadow-2xl overflow-hidden">
      {/* Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground rounded-full z-20" />
      {/* Screen */}
      <div className="relative rounded-[2rem] overflow-hidden bg-muted aspect-[9/19]">
        {scrolling ? (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full animate-phone-scroll"
              loading="lazy"
              style={{ minHeight: '200%' }}
            />
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        )}
        {/* Screen glare */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
    {/* Side buttons */}
    <div className="absolute right-[-8px] top-24 w-[3px] h-10 bg-foreground/70 rounded-r-full" />
    <div className="absolute left-[-8px] top-20 w-[3px] h-6 bg-foreground/70 rounded-l-full" />
    <div className="absolute left-[-8px] top-28 w-[3px] h-6 bg-foreground/70 rounded-l-full" />
  </div>
);

const ROUTES = [
  { emoji: '🍔', name: 'Comidas Rápidas', color: 'from-orange-500 to-red-500', stops: 8 },
  { emoji: '☕', name: 'Ruta del Café', color: 'from-amber-700 to-yellow-600', stops: 6 },
  { emoji: '🌮', name: 'Comida Mexicana', color: 'from-green-600 to-emerald-500', stops: 5 },
  { emoji: '🍣', name: 'Ruta del Sushi', color: 'from-pink-500 to-rose-500', stops: 4 },
  { emoji: '🥩', name: 'Ruta del Asado', color: 'from-red-700 to-orange-600', stops: 6 },
  { emoji: '🍕', name: 'Ruta Italiana', color: 'from-green-500 to-red-500', stops: 5 },
  { emoji: '🍺', name: 'Ruta Cervecera', color: 'from-yellow-500 to-amber-600', stops: 7 },
  { emoji: '🏙️', name: 'Rooftops', color: 'from-indigo-500 to-purple-600', stops: 4 },
];

const RoutesShowcase = () => (
  <div className="w-[300px] md:w-[360px] lg:w-[400px]">
    <div className="grid grid-cols-2 gap-3">
      {ROUTES.map((route, idx) => (
        <motion.div
          key={route.name}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.08 }}
          whileHover={{ scale: 1.05, y: -4 }}
          className="relative group cursor-pointer"
        >
          <div className={`relative rounded-2xl bg-gradient-to-br ${route.color} p-3.5 sm:p-4 shadow-lg overflow-hidden`}>
            <div className="absolute -right-2 -bottom-2 text-5xl opacity-20">{route.emoji}</div>
            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl block mb-1.5">{route.emoji}</span>
              <h4 className="text-white font-bold text-xs sm:text-sm leading-tight mb-1">{route.name}</h4>
              <div className="flex items-center gap-1">
                <Navigation className="h-3 w-3 text-white/70" />
                <span className="text-white/80 text-[10px] sm:text-xs">{route.stops} paradas</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-2xl" />
          </div>
        </motion.div>
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
      className="mt-4 flex items-center justify-center gap-2 bg-card border border-border rounded-full px-4 py-2.5 shadow-md"
    >
      <span className="text-lg">⚽</span>
      <span className="text-xs sm:text-sm font-semibold text-foreground">Completa rutas y gana goles</span>
      <span className="text-lg">🏆</span>
    </motion.div>
  </div>
);

const LandingFeatures = () => {
  return (
    <section id="funciones" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Section header */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 md:mb-28"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">Funciones</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-3 text-foreground">
            Todo lo que{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              necesitas
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            La plataforma más completa para vivir la experiencia gastronómica del Mundial 2026 en Cali.
          </p>
        </motion.div>
      </div>

      {/* Feature rows */}
      <div className="space-y-12 md:space-y-0">
        {features.map((feature, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <div key={feature.title} className={`relative py-12 md:py-20 bg-gradient-to-r ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
              {/* Decorative gradient blob */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-40 pointer-events-none`} />

              <div className="container mx-auto px-6 relative z-10">
                <div className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16 lg:gap-24`}>
                  {/* Visual */}
                  <motion.div
                    initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex-shrink-0"
                  >
                    {i === 1 ? (
                      <RoutesShowcase />
                    ) : (
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <PhoneMockup image={feature.image} title={feature.title} />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Text content */}
                  <motion.div
                    initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    className="flex-1 max-w-xl"
                  >
                    {/* Icon badge */}
                    <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-lg mb-5`}>
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-primary font-semibold text-lg mb-4">
                      {feature.subtitle}
                    </p>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature highlights */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      {i === 0 && (
                        <>
                          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">GPS en tiempo real</span>
                          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">Filtros avanzados</span>
                          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">+50 restaurantes</span>
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">5 rutas temáticas</span>
                          <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">Goles y premios</span>
                          <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">Verificación QR</span>
                        </>
                      )}
                      {i === 2 && (
                        <>
                          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">Videos cortos</span>
                          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">Ambiente real</span>
                          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">Ofertas en video</span>
                        </>
                      )}
                      {i === 3 && (
                        <>
                          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">Escaneo QR</span>
                          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">Puntos automáticos</span>
                          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">Recompensas VIP</span>
                        </>
                      )}
                      {i === 4 && (
                        <>
                          <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">Descuentos exclusivos</span>
                          <span className="px-3 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">Combos mundialistas</span>
                        </>
                      )}
                      {i === 5 && (
                        <>
                          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">Recomendaciones IA</span>
                          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">Chat inteligente</span>
                          <span className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">24/7 disponible</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingFeatures;
