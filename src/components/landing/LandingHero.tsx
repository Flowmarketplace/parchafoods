import { motion } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";

const LandingHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-primary/10 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-[15%] w-64 h-64 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              La app gastronómica del Mundial 2026 🇨🇴
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight text-foreground"
          >
            Vive el Mundial{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              con Sabor
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Descubre los mejores restaurantes para ver cada partido, acumula puntos, recorre rutas mundialistas y vive la experiencia gastronómica más grande de Colombia.{" "}
            <span className="text-foreground font-medium">Comer, saber y vivir. ⚽🍽️</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <a
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all shadow-lg"
            >
              Explorar Restaurantes
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="#que-es"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-muted text-foreground font-semibold text-base hover:bg-muted/80 transition-all"
            >
              <MapPin className="w-5 h-5" />
              ¿Cómo funciona?
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto"
          >
            {[
              { value: "50+", label: "Restaurantes" },
              { value: "🇨🇴", label: "Hecho en Cali" },
              { value: "24/7", label: "Disponible" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
