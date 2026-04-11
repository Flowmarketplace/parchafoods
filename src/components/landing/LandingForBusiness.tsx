import { motion } from "framer-motion";
import { Trophy, Target, Users, Gift, Flame, MapPin } from "lucide-react";

const steps = [
  { icon: MapPin, title: "Sigue las Rutas", description: "Elige entre rutas temáticas como Ruta del Café, Comida Mexicana, Asados y más. Visita los restaurantes de cada ruta.", color: "from-primary to-blue-600" },
  { icon: Target, title: "Acumula Goles", description: "Cada restaurante que visitas te da goles ⚽. Escanea el QR en el lugar para registrar tu visita y sumar puntos.", color: "from-accent to-yellow-500" },
  { icon: Users, title: "Compite en el Ranking", description: "Sube en la tabla de posiciones y demuestra que eres el máximo explorador gastronómico de Cali. ¿Quién tiene más goles?", color: "from-green-500 to-emerald-600" },
  { icon: Gift, title: "Gana Premios", description: "Completa rutas para desbloquear recompensas: descuentos exclusivos, comidas gratis, experiencias VIP y más.", color: "from-pink-500 to-rose-600" },
];

const LandingForBusiness = () => {
  return (
    <section id="negocios" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-accent font-semibold text-sm tracking-wide">Gamificación</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Recorre, compite y{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">gana premios</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Convierte cada comida en una aventura. Sigue rutas gastronómicas, acumula goles con cada visita y compite con otros foodies por increíbles recompensas.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative group"
            >
              <div className="rounded-2xl border border-border bg-card p-6 h-full hover:border-accent/30 hover:shadow-xl transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-lg">
                  {i + 1}
                </div>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative rounded-2xl border border-border bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-primary/10 opacity-50" />
          <div className="relative z-10">
            <div className="flex justify-center gap-3 mb-6">
              {["⚽", "🔥", "🏆", "🎁"].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-4xl md:text-5xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              ¿Listo para el reto?
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Más de 8 rutas temáticas con decenas de restaurantes esperándote. Cada visita cuenta. ¡Empieza a acumular goles hoy!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">8+ rutas</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Ranking en vivo</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Gift className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Premios reales</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingForBusiness;
