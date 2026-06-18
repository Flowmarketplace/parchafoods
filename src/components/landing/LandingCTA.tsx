import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const LandingCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-border bg-card p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-5xl mb-8"
            >
              ⚽
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              ¿Listo para vivir el{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Parchafoods?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Explora los mejores restaurantes de Cali, acumula puntos y disfruta la experiencia gastronómica más grande del Mundial 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/app"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all shadow-lg"
              >
                Entrar a la App
                <ChevronRight className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/573146269531?text=Hola%2C%20quiero%20saber%20más%20sobre%20El%20Mundial%20del%20Sabor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-muted text-foreground font-semibold text-base hover:bg-muted/80 transition-all"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCTA;
