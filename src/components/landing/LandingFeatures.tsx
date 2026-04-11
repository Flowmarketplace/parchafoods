import { motion } from "framer-motion";
import { MapPin, Trophy, Video, QrCode, Star, Bot } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Mapa Interactivo",
    description: "Encuentra restaurantes cercanos con ubicación en tiempo real, filtros por categoría y barrio.",
  },
  {
    icon: Trophy,
    title: "Rutas Mundialistas",
    description: "Recorre rutas temáticas por Cali, acumula goles y desbloquea premios visitando restaurantes.",
  },
  {
    icon: Video,
    title: "Videos & Shorts",
    description: "Mira videos cortos de los restaurantes: sus platos, ambiente y ofertas especiales.",
  },
  {
    icon: QrCode,
    title: "Programa de Lealtad",
    description: "Escanea códigos QR en los restaurantes, acumula puntos y reclama recompensas exclusivas.",
  },
  {
    icon: Star,
    title: "Promociones Exclusivas",
    description: "Accede a descuentos, combos mundialistas y ofertas especiales solo disponibles en la app.",
  },
  {
    icon: Bot,
    title: "Asistente con IA",
    description: "Pregúntale a nuestro asistente inteligente dónde comer, qué pedir y dónde ver el partido.",
  },
];

const LandingFeatures = () => {
  return (
    <section id="funciones" className="py-24 relative">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">Funciones</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Todo lo que <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">necesitas</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            La plataforma más completa para vivir la experiencia gastronómica del Mundial 2026 en Cali.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
