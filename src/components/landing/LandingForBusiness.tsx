import { motion } from "framer-motion";
import { BarChart3, Users, Megaphone, QrCode, Video, Bell } from "lucide-react";
import foodSpread from "@/assets/landing-food-spread.jpg";

const benefits = [
  { icon: Users, title: "Más clientes", description: "Aparece frente a miles de personas buscando dónde comer durante el Mundial." },
  { icon: BarChart3, title: "Analíticas", description: "Métricas de visitas, escaneos QR y rendimiento de tus promociones en tiempo real." },
  { icon: Megaphone, title: "Promociones", description: "Crea ofertas mundialistas que aparecen directamente en la app de tus clientes." },
  { icon: QrCode, title: "Lealtad QR", description: "Sistema de puntos con códigos QR para fidelizar clientes y generar recurrencia." },
  { icon: Video, title: "Videos Shorts", description: "Publica videos cortos mostrando tus platos, ambiente y promos especiales." },
  { icon: Bell, title: "Notificaciones", description: "Envía alertas por proximidad cuando un usuario pase cerca de tu negocio." },
];

const LandingForBusiness = () => {
  return (
    <section id="negocios" className="py-24 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={foodSpread} alt="" className="w-full h-full object-cover opacity-10" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm tracking-widest uppercase">Para Restaurantes</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Impulsa tu <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">negocio</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Únete a la plataforma que conecta tu restaurante con la fiebre mundialista. Más visibilidad, más clientes, más ventas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card/80 backdrop-blur p-7 hover:border-accent/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <b.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://wa.me/573146269531?text=Hola%2C%20quiero%20registrar%20mi%20restaurante%20en%20El%20Mundial%20del%20Sabor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-base hover:brightness-110 transition-all shadow-lg"
          >
            Registrar mi Restaurante 🍽️
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingForBusiness;
