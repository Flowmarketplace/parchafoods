import { motion } from "framer-motion";
import { Search, QrCode, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Explora restaurantes",
    description: "Busca por categoría, barrio o cercanía. Descubre los mejores lugares para ver cada partido del Mundial.",
  },
  {
    icon: QrCode,
    number: "02",
    title: "Visita y escanea",
    description: "Ve al restaurante, disfruta la comida y escanea el código QR para acumular puntos y goles mundialistas.",
  },
  {
    icon: Trophy,
    number: "03",
    title: "Gana recompensas",
    description: "Completa rutas, acumula goles y reclama premios exclusivos en los restaurantes participantes.",
  },
];

const LandingHowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm tracking-widest uppercase">Proceso</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Cómo <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">funciona</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            En 3 simples pasos empiezas a vivir la experiencia mundialista gastronómica.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary via-accent to-secondary opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-card border border-border mx-auto mb-6 flex items-center justify-center relative shadow-lg">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
