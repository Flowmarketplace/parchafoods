import { motion } from "framer-motion";

const LandingWhatIs = () => {
  return (
    <section id="que-es" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
                <div key={item.text} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
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
            {/* Phone mockup */}
            <div className="relative mx-auto w-[280px] h-[560px] rounded-[3rem] border-4 border-foreground/10 bg-card shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/10 rounded-b-2xl" />
              <div className="p-4 pt-8 h-full flex flex-col gap-3">
                <div className="bg-primary/10 rounded-xl p-4 text-center">
                  <span className="text-3xl">⚽</span>
                  <p className="text-sm font-bold text-foreground mt-1">El Mundial del Sabor</p>
                  <p className="text-[10px] text-muted-foreground">Comer, saber y vivir</p>
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-lg">🍔</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Perreiranos</p>
                    <p className="text-[10px] text-muted-foreground">⭐ 4.8 • Comidas Rápidas</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg">🥘</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">La Cocina del Valle</p>
                    <p className="text-[10px] text-muted-foreground">⭐ 4.7 • Restaurante</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-lg">☕</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Café Mundial</p>
                    <p className="text-[10px] text-muted-foreground">⭐ 4.6 • Café</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-3 text-center mt-auto">
                  <p className="text-xs font-bold text-primary-foreground">🏆 ¡Colombia vs Argentina!</p>
                  <p className="text-[10px] text-primary-foreground/80">Hoy 3:00 PM • ¿Dónde verlo?</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingWhatIs;
