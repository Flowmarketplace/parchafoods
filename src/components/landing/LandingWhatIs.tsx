import { motion } from "framer-motion";
import watchingGame from "@/assets/landing-watching-game.jpg";
import mockupRestaurants from "@/assets/mockup-restaurants.png";
import mockupRutas from "@/assets/mockup-rutas.png";

const LandingWhatIs = () => {
  return (
    <section id="que-es" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main intro */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">¿Qué es?</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground leading-tight">
              La app del{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mundial Gastronómico
              </span>
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              <strong className="text-foreground">El Mundial del Sabor 2026</strong> es la plataforma que conecta a los amantes del fútbol con los mejores restaurantes de Cali durante el Mundial FIFA 2026.
            </p>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Descubre dónde ver los partidos de Colombia, recorre rutas temáticas por la ciudad, acumula puntos en cada visita y disfruta de promociones exclusivas mientras vives la fiesta mundialista.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { emoji: "🍽️", text: "Restaurantes verificados" },
                { emoji: "⚽", text: "Calendario de partidos" },
                { emoji: "🗺️", text: "Rutas mundialistas" },
                { emoji: "🎁", text: "Recompensas por visitar" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img
                src={watchingGame}
                alt="Colombianos viendo un partido del mundial en un restaurante"
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
          </motion.div>
        </div>

        {/* App showcase with real mockups */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Así se ve la experiencia ⚽
            </h3>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Mapa interactivo, restaurantes verificados y rutas mundialistas en la palma de tu mano.
            </p>
          </motion.div>

          <div className="flex justify-center items-end gap-4 md:gap-8">
            {/* Left phone - Restaurants */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="hidden sm:block"
            >
              <div className="w-[180px] md:w-[220px] h-[370px] md:h-[450px] rounded-[2rem] border-[4px] border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden">
                <img src={mockupRestaurants} alt="Restaurantes Destacados" className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
            </motion.div>

            {/* Center phone - Home (larger) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="w-[220px] md:w-[280px] h-[450px] md:h-[570px] rounded-[2.5rem] border-[5px] border-foreground/15 bg-foreground/5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/10 rounded-b-2xl z-10" />
                <img src="/mundial-sabor-icon.png" alt="" className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg z-10 opacity-0" />
                <img
                  src={mockupRestaurants}
                  alt="El Mundial del Sabor - Inicio"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl -z-10" />
            </motion.div>

            {/* Right phone - Rutas */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden sm:block"
            >
              <div className="w-[180px] md:w-[220px] h-[370px] md:h-[450px] rounded-[2rem] border-[4px] border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden">
                <img src={mockupRutas} alt="Rutas Mundialistas" className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingWhatIs;
