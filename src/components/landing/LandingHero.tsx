import { motion } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";
import heroBg from "@/assets/landing-hero-bg.jpg";
import mockupHome from "@/assets/mockup-home.png";

const LandingHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-primary/15 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-[15%] w-64 h-64 rounded-full bg-accent/15 blur-[100px]"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-foreground"
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
              className="text-muted-foreground text-base md:text-lg mt-5 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Descubre los mejores restaurantes para ver cada partido, acumula puntos, recorre rutas mundialistas y vive la experiencia gastronómica más grande de Colombia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8"
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-card/80 backdrop-blur border border-border text-foreground font-semibold text-base hover:bg-card transition-all"
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
              className="grid grid-cols-3 gap-6 mt-12 max-w-sm mx-auto lg:mx-0"
            >
              {[
                { value: "50+", label: "Restaurantes" },
                { value: "🇨🇴", label: "Hecho en Cali" },
                { value: "24/7", label: "Disponible" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative w-[300px] h-[620px] rounded-[3rem] border-[6px] border-foreground/15 bg-foreground/5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-foreground/15 rounded-b-2xl z-10" />
                <img
                  src={mockupHome}
                  alt="Parchafoods App"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-8 bg-card border border-border rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚽</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">Partidos en vivo</p>
                    <p className="text-[10px] text-muted-foreground">¿Dónde verlos?</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-2 -left-10 bg-card border border-border rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">+150 goles</p>
                    <p className="text-[10px] text-muted-foreground">Acumulados</p>
                  </div>
                </div>
              </motion.div>
              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
