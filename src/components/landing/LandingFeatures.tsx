import { motion } from "framer-motion";
import { MapPin, Trophy, Video, QrCode, Star, Bot } from "lucide-react";
import featureMapa from "@/assets/feature-mapa.png";
import featureShorts from "@/assets/feature-shorts.png";
import featureEvents from "@/assets/feature-events.png";
import featureLoyalty from "@/assets/feature-loyalty.png";
import featurePromos from "@/assets/feature-promos.png";
import featureAi from "@/assets/feature-ai.png";

const features = [
  {
    icon: MapPin,
    title: "Mapa Interactivo",
    description: "Encuentra restaurantes cercanos con ubicación en tiempo real, filtros por categoría y barrio.",
    image: featureMapa,
  },
  {
    icon: Trophy,
    title: "Rutas Mundialistas",
    description: "Recorre rutas temáticas por Cali, acumula goles y desbloquea premios visitando restaurantes.",
    image: featureEvents,
  },
  {
    icon: Video,
    title: "Videos & Shorts",
    description: "Mira videos cortos de los restaurantes: sus platos, ambiente y ofertas especiales.",
    image: featureShorts,
  },
  {
    icon: QrCode,
    title: "Programa de Lealtad",
    description: "Escanea códigos QR en los restaurantes, acumula puntos y reclama recompensas exclusivas.",
    image: featureLoyalty,
  },
  {
    icon: Star,
    title: "Promociones Exclusivas",
    description: "Accede a descuentos, combos mundialistas y ofertas especiales solo disponibles en la app.",
    image: featurePromos,
  },
  {
    icon: Bot,
    title: "Asistente con IA",
    description: "Pregúntale a nuestro asistente inteligente dónde comer, qué pedir y dónde ver el partido.",
    image: featureAi,
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
              className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image preview */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute bottom-3 left-4 w-10 h-10 rounded-lg bg-primary/90 backdrop-blur flex items-center justify-center shadow-lg">
                  <feature.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>

              {/* Text content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
