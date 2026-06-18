import { motion } from "framer-motion";
import {
  Trophy, Tv, Bell, BarChart3, QrCode, Video, Users, Gift,
  Megaphone, Eye, MapPin, Star, CheckCircle2, ArrowRight,
  Smartphone, Store, TrendingUp, Camera, Sparkles, Target, DollarSign, Globe, Beer
} from "lucide-react";
import andinaLogo from "@/assets/andina-logo.png";
import andinaFestival from "@/assets/andina-festival.jpg";
import andinaCheers from "@/assets/andina-cheers.jpg";
import andinaMatch from "@/assets/andina-match.jpg";
import andinaPush from "@/assets/andina-push.jpg";
import andinaCans from "@/assets/andina-cans.png";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const benefits = [
  { icon: Trophy, title: "Patrocinio Oficial del Evento", description: "Andina como patrocinador oficial de Parchafoods en Cali. Permanencia y presencia en todo el evento.", highlight: true },
  { icon: Smartphone, title: "Patrocinio Oficial de la App", description: "Módulo exclusivo de patrocinador oficial dentro de la aplicación con presencia destacada para todos los usuarios.", highlight: true },
  { icon: Tv, title: "Banner y Video Principal en la App", description: "Espacio premium con banner principal y video destacado visible para todos los usuarios al abrir la aplicación." },
  { icon: Bell, title: "Notificaciones Push a Usuarios", description: "Envío de notificaciones push directas a todos los usuarios registrados de la plataforma con campañas personalizadas." },
  { icon: BarChart3, title: "Data de Consumidores y Restaurantes", description: "Acceso a datos de consumo, comportamiento de usuarios y participación de restaurantes en tiempo real." },
  { icon: Gift, title: "Participación en Premios", description: "Participación directa en el sistema de premios y recompensas a usuarios, asociando la marca con experiencias positivas." },
  { icon: Store, title: "Brandeo en 100 Restaurantes", description: "Sticker oficial de Parchafoods brandeado con Andina en 100 restaurantes participantes de la ciudad." },
  { icon: QrCode, title: "QR Brandeados", description: "Códigos QR personalizados con la marca Andina en cada restaurante participante para tracking de visitas." },
  { icon: Megaphone, title: "Presencia en Redes y Pauta", description: "Presencia en todas las redes sociales del evento y pauta publicitaria en comunidad de foodies de Cali." },
  { icon: Video, title: "Videos Brandeados en 100 Restaurantes", description: "Videos con publicidad comercial de Andina reproducidos en los televisores de los 100 restaurantes participantes." },
  { icon: TrendingUp, title: "KPIs de Colocación de Cerveza", description: "Métricas detalladas de colocación de cerveza Andina en los sitios participantes con reportes periódicos." },
  { icon: Eye, title: "Valla Publicitaria Autopista", description: "Reconocimiento de marca en valla publicitaria en la autopista con Calle 44, una de las vías más transitadas de Cali." },
  { icon: Camera, title: "20 Videos Publicitarios UGC", description: "Creación de 20 videos publicitarios de contenido generado por usuarios (UGC) exclusivos para Andina." },
  { icon: Sparkles, title: "30 Videos con IA Publicitarios", description: "Producción de 30 videos publicitarios generados con Inteligencia Artificial para campañas digitales de Andina." },
];

const worldCupStats = [
  { value: "US$80.000M", label: "Impacto económico global del Mundial 2026", source: "Forbes / FIFA" },
  { value: "30-50%", label: "Aumento proyectado de ventas en comercio colombiano", source: "ColombiaOne" },
  { value: "US$13.900M", label: "Gasto estimado de hinchas acompañando selecciones", source: "FIFA / OMC" },
  { value: "824.000", label: "Empleos que generará el Mundial a nivel mundial", source: "FIFA / OMC" },
  { value: "6M", label: "Visitantes esperados solo en EE.UU. para el Mundial", source: "Semana" },
  { value: "48", label: "Selecciones participantes — el Mundial más grande de la historia", source: "FIFA" },
];

const keyNumbers = [
  { value: "100", label: "Restaurantes brandeados", icon: Store },
  { value: "50K+", label: "Usuarios esperados", icon: Users },
  { value: "50", label: "Videos producidos", icon: Video },
  { value: "1", label: "Valla publicitaria", icon: Eye },
];

const AndinaProposal = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero con imagen de fondo */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={andinaFestival} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
        </div>

        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >⚽</motion.div>
        <motion.div
          className="absolute bottom-32 right-16 text-5xl opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >🍺</motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 font-medium text-sm">Propuesta de Patrocinio Oficial</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
            <img src={andinaLogo} alt="Cerveza Andina" className="h-20 md:h-28 mx-auto mb-8 drop-shadow-2xl" />
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Patrocinador Oficial de<br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Parchafoods</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.35 }} className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            La oportunidad única de conectar Cerveza Andina con más de 50,000 usuarios y 100 restaurantes
            durante el evento gastronómico más grande de Cali para el Mundial FIFA 2026.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.45 }}>
            <a
              href="https://wa.me/573146269531?text=Hola%2C%20soy%20de%20Andina%20y%20me%20interesa%20la%20propuesta%20de%20patrocinio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-lg hover:brightness-110 transition-all shadow-2xl shadow-yellow-500/20"
            >
              Hablemos <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Key Numbers */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {keyNumbers.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <item.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{item.value}</div>
                <div className="text-muted-foreground text-sm">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === EL MUNDIAL EN CIFRAS === */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={andinaMatch} alt="" className="w-full h-full object-cover opacity-10" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-5">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-accent font-semibold text-sm">Datos del Mundial 2026</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              El evento más grande del{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">planeta</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              El Mundial FIFA 2026 será el más grande de la historia. Colombia proyecta un aumento de ventas del 30% al 50% en comercio, bares y restaurantes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {worldCupStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-yellow-500/30 hover:shadow-lg transition-all group"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-foreground text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-muted-foreground text-xs">Fuente: {stat.source}</p>
              </motion.div>
            ))}
          </div>

          {/* Extra context card */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                <Beer className="w-7 h-7 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">¿Por qué cerveza + Mundial + restaurantes?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  El sector de alimentos y bebidas lidera el impacto económico del Mundial. Las reuniones sociales para ver partidos disparan el consumo en bares y restaurantes. 
                  Según proyecciones, <strong className="text-foreground">el comercio colombiano espera un aumento del 30% al 50% en ventas</strong> durante el torneo, 
                  con la cerveza como la bebida protagonista de cada celebración. Andina tiene la oportunidad de posicionarse como la cerveza oficial de esta experiencia gastronómica.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === BENEFICIOS === */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Beneficios del Patrocinio</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Todo lo que recibe{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Andina</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Una alianza estratégica que posiciona a Cerveza Andina como la cerveza oficial del evento gastronómico más importante de Cali.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl group ${
                  benefit.highlight
                    ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 hover:border-yellow-500/50"
                    : "border-border bg-card hover:border-accent/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                    benefit.highlight ? "bg-gradient-to-br from-yellow-500 to-amber-500" : "bg-accent/10"
                  }`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.highlight ? "text-black" : "text-accent"}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
                {benefit.highlight && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 text-xs font-semibold">EXCLUSIVO PATROCINADOR OFICIAL</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === IMAGEN FULL WIDTH: CHEERS === */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={andinaCheers} alt="Brindis con cerveza" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <motion.div {...fadeUp} className="container mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              La cerveza del momento
            </h3>
            <p className="text-white/70 text-lg max-w-xl">
              Cada partido es una reunión, cada reunión una oportunidad. Andina presente en la mesa de cada celebración mundialista.
            </p>
          </motion.div>
        </div>
      </section>

      {/* === PUSH NOTIFICATIONS === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0033A0]/5 via-background to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-5">
              <Bell className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 font-semibold text-sm">Notificaciones Push</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Directo al{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">bolsillo</span>
              {" "}de 50K+ usuarios
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Envía mensajes a miles de personas justo cuando Colombia va a jugar. 
              Tasa de apertura del <strong className="text-foreground">90%</strong> vs. email (20%) o redes (5%).
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: Bell, color: "from-yellow-500 to-amber-500", iconColor: "text-black", title: "Andina 🍺", msg: "¡Colombia juega hoy a las 4pm! Pide tu Andina helada en cualquier restaurante de la ruta mundialista 🇨🇴⚽", time: "Ahora" },
              { icon: Gift, color: "from-green-500 to-emerald-500", iconColor: "text-white", title: "Promo Andina", msg: "2x1 en Cerveza Andina este fin de semana en 30 restaurantes de Parchafoods 🎉", time: "Hace 2h" },
              { icon: Megaphone, color: "from-blue-500 to-indigo-500", iconColor: "text-white", title: "¡Gol de Colombia!", msg: "Celebra con una Andina 🍻 Muestra esta notificación y recibe 20% de descuento", time: "Hace 5min" },
            ].map((notif, i) => (
              <motion.div
                key={notif.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-yellow-500/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center flex-shrink-0`}>
                    <notif.icon className={`w-5 h-5 ${notif.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground font-bold text-sm">{notif.title}</span>
                      <span className="text-muted-foreground text-[10px]">{notif.time}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{notif.msg}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { value: "90%", label: "Apertura" },
              { value: "50K+", label: "Alcance" },
              { value: "∞", label: "Envíos" },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === CONSUMER DATA INTELLIGENCE === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content — left this time */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-sm">Data de Consumidores</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
                Conoce a tu{" "}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">consumidor</span>
                {" "}como nunca antes
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                Accede a datos reales de comportamiento gastronómico: qué restaurantes visitan, cuándo consumen, 
                qué categorías prefieren y dónde se concentran. Información de primera mano que ninguna otra plataforma ofrece.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: MapPin, label: "Ubicación y barrios", value: "GPS tracking" },
                  { icon: Target, label: "Hábitos de consumo", value: "Frecuencia" },
                  { icon: Store, label: "Restaurantes visitados", value: "Preferencias" },
                  { icon: TrendingUp, label: "Tendencias", value: "Tiempo real" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-card"
                  >
                    <item.icon className="w-5 h-5 text-primary mb-2" />
                    <div className="text-foreground text-sm font-bold">{item.label}</div>
                    <div className="text-muted-foreground text-xs">{item.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong>💡 Valor para Andina:</strong> Con esta data puedes optimizar la distribución de cerveza, 
                  identificar los restaurantes con mayor rotación, planificar campañas hiper-segmentadas y 
                  medir el impacto real de cada acción de marketing durante el Mundial.
                </p>
              </div>
            </motion.div>

            {/* Visual — dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground text-xs ml-2">Dashboard — Andina Analytics</span>
                </div>

                {/* Mock chart bars */}
                <div className="mb-6">
                  <div className="text-muted-foreground text-xs mb-3 uppercase tracking-wider">Consumo por categoría gastronómica</div>
                  <div className="space-y-3">
                    {[
                      { label: "Comidas Rápidas", pct: 85, color: "from-yellow-500 to-amber-500" },
                      { label: "Asados & Parrilla", pct: 72, color: "from-orange-500 to-red-500" },
                      { label: "Bares & Rooftops", pct: 68, color: "from-purple-500 to-indigo-500" },
                      { label: "Restaurantes Casual", pct: 55, color: "from-blue-500 to-cyan-500" },
                      { label: "Comida Mexicana", pct: 45, color: "from-green-500 to-emerald-500" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground font-medium">{bar.label}</span>
                          <span className="text-muted-foreground">{bar.pct}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Escaneos QR", value: "12,847", trend: "+34%" },
                    { label: "Usuarios activos", value: "8,234", trend: "+28%" },
                    { label: "Restaurantes", value: "100", trend: "100%" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-muted/50 text-center">
                      <div className="text-foreground font-bold text-lg">{stat.value}</div>
                      <div className="text-muted-foreground text-[10px]">{stat.label}</div>
                      <div className="text-green-500 text-xs font-semibold mt-1">{stat.trend}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-5 right-8 bg-gradient-to-r from-primary to-blue-400 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-bold">Data en tiempo real</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === DATA & REACH === */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-accent/5 p-8 md:p-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-bl-full" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-accent font-semibold text-sm tracking-widest uppercase">Alcance Garantizado</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Datos que respaldan la inversión</h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  Con Parchafoods, Andina accede a una base activa de consumidores gastronómicos en Cali, 
                  con datos precisos de comportamiento, preferencias y ubicación.
                </p>
                <ul className="space-y-3">
                  {[
                    "Datos de 100 restaurantes participantes",
                    "Visitas estimadas de 50,000+ usuarios",
                    "KPIs de colocación de cerveza en tiempo real",
                    "Métricas de engagement y escaneos QR",
                    "Segmentación por barrio, categoría y hábitos"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: "50K+", label: "Usuarios activos", emoji: "👥" },
                  { number: "100", label: "Restaurantes", emoji: "🍽️" },
                  { number: "50", label: "Videos producidos", emoji: "🎬" },
                  { number: "100%", label: "Visibilidad digital", emoji: "📱" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-background/80 border border-border rounded-2xl p-5 text-center"
                  >
                    <span className="text-3xl mb-2 block">{stat.emoji}</span>
                    <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === PRODUCCIÓN DE CONTENIDO === */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Producción de Contenido</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Contenido exclusivo para{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Andina</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Camera, number: "20", title: "Videos UGC", description: "Videos publicitarios de contenido generado por usuarios reales consumiendo en restaurantes con Cerveza Andina.", gradient: "from-pink-500 to-rose-600" },
              { icon: Sparkles, number: "30", title: "Videos con IA", description: "Videos publicitarios generados con Inteligencia Artificial para campañas digitales innovadoras de la marca.", gradient: "from-purple-500 to-indigo-600" },
              { icon: Tv, number: "100", title: "Videos en Restaurantes", description: "Publicidad comercial de Andina reproducida en televisores de los 100 restaurantes participantes.", gradient: "from-blue-500 to-cyan-600" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-8 text-center hover:shadow-xl transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">{item.number}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA FINAL === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={andinaMatch} alt="" className="w-full h-full object-cover opacity-20" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e]/90 via-[#0d1b3e]/95 to-[#0a0a1a]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeUp}>
            <img src={andinaLogo} alt="Cerveza Andina" className="h-16 mx-auto mb-8 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">¿Listo para ser el patrocinador oficial?</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              Hablemos sobre cómo Cerveza Andina puede ser la cerveza oficial de Parchafoods en Cali.
            </p>
            <a
              href="https://wa.me/573146269531?text=Hola%2C%20soy%20de%20Andina%20y%20me%20interesa%20la%20propuesta%20de%20patrocinio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-lg hover:brightness-110 transition-all shadow-2xl shadow-yellow-500/20"
            >
              Contactar ahora <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Parchafoods · Propuesta confidencial para Cerveza Andina · Cali, Colombia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AndinaProposal;
