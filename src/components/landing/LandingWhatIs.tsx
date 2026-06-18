import { motion } from "framer-motion";
import watchingGame from "@/assets/landing-watching-game.jpg";
import mockupHome from "@/assets/mockup-home.png";
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
              <strong className="text-foreground">Parchafoods</strong> es la plataforma que conecta a los amantes del fútbol con los mejores restaurantes de Cali durante el Mundial FIFA 2026.
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

          <div className="flex justify-center items-end gap-6 md:gap-10">
            {/* Left phone - Restaurants */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="hidden sm:block"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Phone case */}
                <div className="relative w-[180px] md:w-[220px] h-[370px] md:h-[450px] rounded-[2.5rem] bg-foreground/90 p-[6px] shadow-2xl">
                  {/* Inner bezel */}
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                    {/* Status bar / notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-10" />
                    {/* Screen content */}
                    <img src={mockupRestaurants} alt="Restaurantes Destacados" className="w-full h-full object-cover object-top" loading="lazy" />
                    {/* Screen glare */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                  {/* Side buttons */}
                  <div className="absolute -right-[2px] top-24 w-[3px] h-8 bg-foreground/70 rounded-r-sm" />
                  <div className="absolute -left-[2px] top-20 w-[3px] h-6 bg-foreground/70 rounded-l-sm" />
                  <div className="absolute -left-[2px] top-32 w-[3px] h-10 bg-foreground/70 rounded-l-sm" />
                </div>
              </motion.div>
            </motion.div>

            {/* Center phone - Home (larger) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {/* Phone case */}
                <div className="relative w-[230px] md:w-[280px] h-[470px] md:h-[570px] rounded-[3rem] bg-foreground/90 p-[7px] shadow-2xl">
                  {/* Inner bezel */}
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
                    {/* Screen content */}
                    <img
                      src={mockupHome}
                      alt="Parchafoods - Inicio"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    {/* Screen glare */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                  {/* Side buttons */}
                  <div className="absolute -right-[2px] top-28 w-[3px] h-10 bg-foreground/70 rounded-r-sm" />
                  <div className="absolute -left-[2px] top-24 w-[3px] h-7 bg-foreground/70 rounded-l-sm" />
                  <div className="absolute -left-[2px] top-36 w-[3px] h-12 bg-foreground/70 rounded-l-sm" />
                </div>
              </motion.div>
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl -z-10" />
            </motion.div>

            {/* Right phone - Rutas */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden sm:block"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                {/* Phone case */}
                <div className="relative w-[180px] md:w-[220px] h-[370px] md:h-[450px] rounded-[2.5rem] bg-foreground/90 p-[6px] shadow-2xl">
                  {/* Inner bezel */}
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                    {/* Status bar / notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-10" />
                    {/* Screen content */}
                    <img src={mockupRutas} alt="Rutas Mundialistas" className="w-full h-full object-cover object-top" loading="lazy" />
                    {/* Screen glare */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                  {/* Side buttons */}
                  <div className="absolute -right-[2px] top-24 w-[3px] h-8 bg-foreground/70 rounded-r-sm" />
                  <div className="absolute -left-[2px] top-20 w-[3px] h-6 bg-foreground/70 rounded-l-sm" />
                  <div className="absolute -left-[2px] top-32 w-[3px] h-10 bg-foreground/70 rounded-l-sm" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingWhatIs;
