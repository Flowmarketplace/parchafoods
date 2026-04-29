import { motion } from "framer-motion";
import {
  Trophy, Tv, Bell, BarChart3, QrCode, Video, Users, Gift,
  Megaphone, Eye, MapPin, Star, CheckCircle2, ArrowRight,
  Smartphone, Store, TrendingUp, Camera, Sparkles, Target, Globe, Beef,
  Award, Gem, Crown, Flame, Truck, Utensils
} from "lucide-react";
import qmenuMeats from "@/assets/qmenu-meats.jpg";
import qmenuGrill from "@/assets/qmenu-grill.jpg";
import qmenuDistribution from "@/assets/qmenu-distribution.jpg";
import qmenuFeast from "@/assets/qmenu-feast.jpg";
import qmenuStorefront from "@/assets/qmenu-storefront.png";
import qmenuStaff from "@/assets/qmenu-staff.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const benefits = [
  { icon: Trophy, title: "Patrocinio Oficial del Evento", description: "Q'Menu como distribuidor oficial de carnes de El Mundial del Sabor 2026 en Cali. Permanencia y presencia en todo el evento.", highlight: true },
  { icon: Smartphone, title: "Patrocinio Oficial de la App", description: "Módulo exclusivo de patrocinador oficial dentro de la aplicación con presencia destacada para todos los usuarios.", highlight: true },
  { icon: Tv, title: "Banner y Video Principal en la App", description: "Espacio premium con banner principal y video destacado visible para todos los usuarios al abrir la aplicación." },
  { icon: Bell, title: "Notificaciones Push a Usuarios", description: "Envío de notificaciones push directas a todos los usuarios registrados con campañas personalizadas según el plan contratado." },
  { icon: BarChart3, title: "Data de Restaurantes y Consumidores", description: "Acceso a datos de consumo de carnes, comportamiento de usuarios y rotación en restaurantes en tiempo real." },
  { icon: Gift, title: "Participación en Premios", description: "Participación directa en el sistema de premios y recompensas asociando Q'Menu a la mejor parrilla del Mundial." },
  { icon: Store, title: "Brandeo en Restaurantes Aliados", description: "Sticker oficial del Mundial del Sabor brandeado con Q'Menu. Inicio con 100 restaurantes durante el Mundial y proyección de 1,200 al cierre de 2026." },
  { icon: QrCode, title: "QR Brandeados Q'Menu", description: "Códigos QR personalizados con la marca Q'Menu en cada restaurante participante para tracking de visitas y consumo." },
  { icon: Megaphone, title: "Presencia en Redes y Pauta", description: "Presencia en todas las redes sociales del evento y pauta publicitaria en la comunidad de foodies de Cali." },
  { icon: Video, title: "Videos Brandeados en Restaurantes", description: "Videos con publicidad comercial de Q'Menu reproducidos en los televisores de los restaurantes participantes (100 al inicio, escalando a 1,200 en 2026)." },
  { icon: TrendingUp, title: "KPIs de Colocación de Carnes", description: "Métricas detalladas de colocación y rotación de cortes Q'Menu en los sitios participantes con reportes periódicos." },
  { icon: Eye, title: "Valla Publicitaria Autopista", description: "Reconocimiento de marca en valla publicitaria en la autopista con Calle 44, una de las vías más transitadas de Cali." },
  { icon: Camera, title: "20 Videos Publicitarios UGC", description: "Creación de 20 videos publicitarios de contenido generado por usuarios (UGC) exclusivos para Q'Menu." },
  { icon: Sparkles, title: "30 Videos con IA Publicitarios", description: "Producción de 30 videos publicitarios generados con Inteligencia Artificial para campañas digitales de Q'Menu." },
];

const worldCupStats = [
  { value: "US$80.000M", label: "Impacto económico global del Mundial 2026", source: "Forbes / FIFA" },
  { value: "30-50%", label: "Aumento proyectado de ventas en comercio colombiano", source: "ColombiaOne" },
  { value: "+45%", label: "Aumento estimado en consumo de carnes durante mundiales", source: "Fenavi / DANE" },
  { value: "US$13.900M", label: "Gasto estimado de hinchas acompañando selecciones", source: "FIFA / OMC" },
  { value: "6M", label: "Visitantes esperados solo en EE.UU. para el Mundial", source: "Semana" },
  { value: "48", label: "Selecciones participantes — el Mundial más grande de la historia", source: "FIFA" },
];

const keyNumbers = [
  { value: "100 → 1,200", label: "Restaurantes (inicio Mundial → cierre 2026)", icon: Store },
  { value: "50K+", label: "Usuarios esperados", icon: Users },
  { value: "50", label: "Videos producidos", icon: Video },
  { value: "1", label: "Valla publicitaria", icon: Eye },
];

const sponsorPlans = [
  {
    tier: "bronce",
    name: "Patrocinio Bronce",
    price: "$15M",
    icon: Award,
    gradient: "from-orange-700 to-orange-500",
    description: "Plan de entrada con presencia activa en la app y campañas mensuales.",
    features: [
      "8 notificaciones push al mes",
      "1 banner principal rotativo",
      "Segmentación geográfica básica",
      "Reporte mensual de métricas",
      "Logo en sección de patrocinadores",
    ],
  },
  {
    tier: "plata",
    name: "Patrocinio Plata",
    price: "$30M",
    icon: Gem,
    gradient: "from-slate-500 to-slate-300",
    description: "Mayor visibilidad y datos avanzados para campañas más efectivas.",
    features: [
      "15 notificaciones push al mes",
      "3 banners principales",
      "Segmentación geo + categorías",
      "Acceso a data avanzada",
      "Soporte prioritario",
      "Branding en eventos seleccionados",
    ],
  },
  {
    tier: "oro",
    name: "Patrocinio Oro",
    price: "$50M",
    icon: Crown,
    gradient: "from-yellow-600 to-yellow-400",
    description: "Máxima exposición, datos completos y campañas con CTAs avanzados.",
    features: [
      "45 notificaciones push al mes",
      "6 banners principales permanentes",
      "Segmentación geo + categoría + zona",
      "Acceso completo a data y analítica",
      "Soporte dedicado",
      "Branding en todos los eventos",
      "CTAs avanzados (mensaje, llamada, WhatsApp)",
      "Mención en Shorts y recomendaciones",
    ],
    highlight: true,
  },
];

const dashboardModules = [
  { icon: BarChart3, title: "Dashboard de Métricas", description: "KPIs en tiempo real: tasa de apertura, CTR, conversiones, CPC y CPA con gráficos de torta y embudo." },
  { icon: Bell, title: "Campañas Push", description: "Crea, programa y envía notificaciones push con preview real del móvil antes de lanzar." },
  { icon: Store, title: "Estadísticas de Restaurantes", description: "Visualiza qué restaurantes consumen más Q'Menu, rotación por zona y categoría." },
  { icon: Award, title: "Solicitud de Planes", description: "Contrata planes Bronce, Plata u Oro y administra tus solicitudes desde el panel." },
  { icon: Smartphone, title: "Perfil Patrocinador", description: "Sube tu logo, datos de contacto, redes sociales y mantén tu marca actualizada en toda la app." },
  { icon: Target, title: "Segmentación Avanzada", description: "Filtra audiencias por barrio, categoría gastronómica y comportamiento de usuario." },
];

const QmenuProposal = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={qmenuMeats} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-background" />
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
        >🥩</motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 font-medium text-sm">Propuesta de Patrocinio Oficial</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl" style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-0.04em' }}>
              Q'menu
            </h2>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Distribuidor Oficial de Carnes<br />
            <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">El Mundial del Sabor</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.35 }} className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            La oportunidad única de posicionar Q'Menu como la carne oficial del evento gastronómico más grande de Cali.
            Arrancamos con <strong className="text-white">100 restaurantes durante la temporada del Mundial FIFA 2026</strong>{" "}
            y proyectamos cerrar el año con <strong className="text-yellow-400">1,200 restaurantes inscritos</strong> y más de 50,000 usuarios activos.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.45 }}>
            <a
              href="https://wa.me/573146269531?text=Hola%2C%20soy%20de%20Q%27Menu%20y%20me%20interesa%20la%20propuesta%20de%20patrocinio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg hover:brightness-110 transition-all shadow-2xl shadow-red-500/30"
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
          <img src={qmenuGrill} alt="" className="w-full h-full object-cover opacity-10" loading="lazy" />
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
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">planeta</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              El Mundial FIFA 2026 será el más grande de la historia. Colombia proyecta un aumento de ventas del 30% al 50% en comercio, bares y restaurantes — con la parrilla y la carne como protagonistas.
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
                className="rounded-2xl border border-border bg-card p-6 hover:border-red-500/30 hover:shadow-lg transition-all"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-foreground text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-muted-foreground text-xs">Fuente: {stat.source}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5 p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Beef className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">¿Por qué carne + Mundial + restaurantes?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Cada partido es una excusa para reunirse a comer. La parrilla, los asados y la picada son los protagonistas de cada celebración mundialista.
                  Según proyecciones, <strong className="text-foreground">el consumo de carnes aumenta hasta un 45% durante mundiales</strong> y los restaurantes
                  con parrilla son los más visitados. Q'Menu tiene la oportunidad de posicionarse como la carne oficial detrás de cada parrilla del Mundial del Sabor.
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
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Q'Menu</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Una alianza estratégica que posiciona a Q'Menu como el distribuidor oficial de carnes del evento gastronómico más importante de Cali.
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
                    ? "border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5 hover:border-red-500/50"
                    : "border-border bg-card hover:border-accent/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                    benefit.highlight ? "bg-gradient-to-br from-red-600 to-orange-500" : "bg-accent/10"
                  }`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.highlight ? "text-white" : "text-accent"}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === IMAGEN FULL WIDTH: FEAST === */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={qmenuFeast} alt="Parrillada Mundial" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <motion.div {...fadeUp} className="container mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              La carne del momento
            </h3>
            <p className="text-white/70 text-lg max-w-xl">
              Cada partido es una parrillada, cada parrillada una oportunidad. Q'Menu presente en cada corte servido durante el Mundial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* === DASHBOARD DE PATROCINADORES === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-5">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-semibold text-sm">Plataforma de Patrocinadores</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Tu propio{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">dashboard</span>
              {" "}de control
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Q'Menu accede a un panel exclusivo para administrar campañas, ver métricas en tiempo real y gestionar su patrocinio.
            </p>
          </motion.div>

          {/* Módulos del dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {dashboardModules.map((mod, i) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-orange-500/30 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <mod.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{mod.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{mod.description}</p>
              </motion.div>
            ))}
          </div>

          {/* === SCREENSHOTS DEL DASHBOARD === */}
          <motion.div {...fadeUp} className="text-center mb-10">
            <span className="text-red-500 font-semibold text-sm tracking-widest uppercase">Vista previa del panel</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
              Así se ve el dashboard de Q'Menu
            </h3>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Capturas de las pantallas reales que Q'Menu tendrá disponibles desde el primer día.
            </p>
          </motion.div>

          {/* SCREENSHOT 1 — MÉTRICAS / KPIs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-[#0f0f10] p-4 md:p-6 shadow-2xl mb-10 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white/50 text-xs ml-3 truncate">elmundialdelsabor.com / sponsor / metrics</span>
              <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-semibold hidden md:inline">● EN VIVO</span>
            </div>

            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <h4 className="text-white text-lg md:text-xl font-bold">Métricas de Campañas</h4>
                <p className="text-white/50 text-xs">Resultados consolidados · últimos 30 días</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 text-white/70">Hoy</span>
                <span className="text-[10px] px-3 py-1.5 rounded-lg bg-red-500 text-white font-semibold">30 días</span>
                <span className="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 text-white/70 hidden md:inline">90 días</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Tasa de apertura", value: "68.4%", trend: "+12%" },
                { label: "CTR (Click-through)", value: "24.1%", trend: "+8%" },
                { label: "Costo por adquisición", value: "$1,840", trend: "-15%" },
                { label: "ROI campaña", value: "340%", trend: "+22%" },
              ].map((k) => (
                <div key={k.label} className="rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-3 md:p-4">
                  <div className="text-white/50 text-[10px] uppercase tracking-wider mb-1">{k.label}</div>
                  <div className="text-white text-xl md:text-2xl font-black">{k.value}</div>
                  <div className="text-[10px] font-semibold text-green-400 mt-1">{k.trend} vs mes anterior</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-white/70 text-xs font-semibold mb-3">Distribución de conversiones (torta)</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="4" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="42 100" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="28 100" strokeDashoffset="-42" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="18 100" strokeDashoffset="-70" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#84cc16" strokeWidth="4" strokeDasharray="12 100" strokeDashoffset="-88" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-white text-lg font-black">12K</span>
                      <span className="text-white/50 text-[9px]">conv.</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs flex-1">
                    {[
                      { c: "bg-red-500", l: "Reservas", v: "42%" },
                      { c: "bg-orange-500", l: "Clics WhatsApp", v: "28%" },
                      { c: "bg-yellow-500", l: "Llamadas", v: "18%" },
                      { c: "bg-lime-500", l: "Visitas perfil", v: "12%" },
                    ].map((s) => (
                      <div key={s.l} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.c}`} />
                        <span className="text-white/70 flex-1">{s.l}</span>
                        <span className="text-white font-semibold">{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-white/70 text-xs font-semibold mb-3">Embudo de conversión</div>
                <div className="space-y-2">
                  {[
                    { l: "Impresiones", v: "245,000", w: "100%", c: "from-red-500 to-red-600" },
                    { l: "Aperturas", v: "167,580", w: "68%", c: "from-orange-500 to-red-500" },
                    { l: "Clics", v: "59,049", w: "24%", c: "from-yellow-500 to-orange-500" },
                    { l: "Conversiones", v: "12,047", w: "4.9%", c: "from-lime-500 to-yellow-500" },
                  ].map((step) => (
                    <div key={step.l}>
                      <div className="flex justify-between text-[10px] text-white/70 mb-1">
                        <span>{step.l}</span>
                        <span className="font-semibold text-white">{step.v}</span>
                      </div>
                      <div className="h-5 rounded-md bg-white/5 overflow-hidden relative">
                        <div className={`h-full bg-gradient-to-r ${step.c} flex items-center justify-end pr-2`} style={{ width: step.w }}>
                          <span className="text-[9px] font-bold text-white">{step.w}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* SCREENSHOT 2 — CAMPAÑAS PUSH */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-[#0f0f10] p-4 md:p-6 shadow-2xl mb-10"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white/50 text-xs ml-3 truncate">elmundialdelsabor.com / sponsor / campaigns</span>
            </div>

            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <h4 className="text-white text-lg md:text-xl font-bold">Gestión de Campañas Push</h4>
                <p className="text-white/50 text-xs">Crea, programa y mide notificaciones</p>
              </div>
              <button className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold shadow-lg shadow-red-500/30">
                + Nueva campaña
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: "🥩 Reserva tu mesa con la mejor parrilla Q'Menu", status: "Activa", statusColor: "bg-green-500/20 text-green-400", sent: "12,400", opened: "68%", clicked: "24%", date: "Hoy 18:30" },
                { title: "🔥 Esta noche: 2x1 en cortes premium Q'Menu", status: "Activa", statusColor: "bg-green-500/20 text-green-400", sent: "8,200", opened: "72%", clicked: "31%", date: "Hace 2h" },
                { title: "⚽ Especial Mundial: parrilladas para tu equipo", status: "Programada", statusColor: "bg-blue-500/20 text-blue-400", sent: "—", opened: "—", clicked: "—", date: "Mañana 12:00" },
                { title: "🎉 Celebra el primer gol con cortes Q'Menu", status: "Finalizada", statusColor: "bg-white/10 text-white/60", sent: "15,800", opened: "64%", clicked: "19%", date: "Hace 5d" },
              ].map((c) => (
                <div key={c.title} className="rounded-xl bg-white/5 border border-white/10 p-3 md:p-4 hover:border-red-500/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{c.title}</p>
                      <p className="text-white/40 text-[10px] mt-0.5">{c.date}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold whitespace-nowrap ${c.statusColor}`}>{c.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-black/30 p-2">
                      <div className="text-white/50 text-[9px]">ENVIADAS</div>
                      <div className="text-white font-bold text-sm">{c.sent}</div>
                    </div>
                    <div className="rounded-lg bg-black/30 p-2">
                      <div className="text-white/50 text-[9px]">APERTURA</div>
                      <div className="text-orange-400 font-bold text-sm">{c.opened}</div>
                    </div>
                    <div className="rounded-lg bg-black/30 p-2">
                      <div className="text-white/50 text-[9px]">CTR</div>
                      <div className="text-red-400 font-bold text-sm">{c.clicked}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SCREENSHOT 3 — RESTAURANTES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-[#0f0f10] p-4 md:p-6 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white/50 text-xs ml-3 truncate">elmundialdelsabor.com / sponsor / business</span>
            </div>

            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <h4 className="text-white text-lg md:text-xl font-bold">Restaurantes afiliados</h4>
                <p className="text-white/50 text-xs">Crecimiento proyectado: 100 (Mundial) → 1,200 (cierre 2026)</p>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-black">1,200</div>
                <div className="text-green-400 text-[10px] font-semibold">Meta 2026</div>
              </div>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
              <div className="text-white/70 text-xs font-semibold mb-3">Crecimiento de restaurantes inscritos · 2026</div>
              <div className="flex items-end gap-1.5 h-32">
                {[
                  { m: "Ene", v: 8 },
                  { m: "Feb", v: 12 },
                  { m: "Mar", v: 18 },
                  { m: "Abr", v: 28 },
                  { m: "May", v: 42 },
                  { m: "Jun", v: 58, highlight: true },
                  { m: "Jul", v: 72, highlight: true },
                  { m: "Ago", v: 80 },
                  { m: "Sep", v: 86 },
                  { m: "Oct", v: 91 },
                  { m: "Nov", v: 96 },
                  { m: "Dic", v: 100 },
                ].map((b) => (
                  <div key={b.m} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end h-full">
                      <div
                        className={`w-full rounded-t-md ${b.highlight ? "bg-gradient-to-t from-red-600 to-orange-400" : "bg-gradient-to-t from-red-500/40 to-orange-500/40"}`}
                        style={{ height: `${b.v}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-white/50">{b.m}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-white/60 mt-3 pt-3 border-t border-white/5 flex-wrap">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-orange-500" /> Temporada Mundial (Jun-Jul)</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500/40" /> Crecimiento orgánico</div>
                <div className="ml-auto text-white/70">Cierre Dic 2026: <strong className="text-white">1,200 restaurantes</strong></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-white/70 text-xs font-semibold mb-3">🏆 Top restaurantes consumo Q'Menu</div>
                <div className="space-y-2">
                  {[
                    { n: "Tratoría Sushi Green", kg: "284 kg", pct: 92 },
                    { n: "Cilindro Municipal", kg: "248 kg", pct: 80 },
                    { n: "El Corte de la Res", kg: "221 kg", pct: 71 },
                    { n: "Pura Casta", kg: "198 kg", pct: 64 },
                  ].map((r, i) => (
                    <div key={r.n} className="flex items-center gap-2">
                      <span className="text-white/50 text-xs w-4">{i + 1}</span>
                      <span className="text-white text-xs flex-1 truncate">{r.n}</span>
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-white/70 text-[10px] w-12 text-right">{r.kg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="text-white/70 text-xs font-semibold mb-3">📍 Distribución por zona de Cali</div>
                <div className="space-y-2">
                  {[
                    { z: "Norte (Granada, Centenario)", n: 28, c: "bg-red-500" },
                    { z: "Sur (Ciudad Jardín, Pance)", n: 24, c: "bg-orange-500" },
                    { z: "Oeste (San Antonio, Peñón)", n: 22, c: "bg-yellow-500" },
                    { z: "Este (Versalles, Caney)", n: 16, c: "bg-lime-500" },
                    { z: "Centro histórico", n: 10, c: "bg-emerald-500" },
                  ].map((z) => (
                    <div key={z.z} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${z.c}`} />
                      <span className="text-white text-xs flex-1 truncate">{z.z}</span>
                      <span className="text-white/70 text-[10px] font-semibold">{z.n}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === SECCIÓN PERSONALIZADA Q'MENU === */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-orange-500/5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-red-500/20">
                <img src={qmenuStorefront} alt="Local Q'Menu Cali" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold shadow-lg">
                    🥩 Q'Menu · Cali
                  </span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-6">
                <div className="text-center px-1">
                  <div className="text-[10px] text-white/80 font-semibold leading-tight">INICIO</div>
                  <div className="text-2xl font-black text-white leading-none">100</div>
                  <div className="text-[8px] text-white/90 font-semibold mt-0.5">→ 1,200 al cierre</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <span className="text-red-500 font-semibold text-sm tracking-widest uppercase">Hecho a la medida de Q'Menu</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-5 leading-tight">
                De su local en Cali a las{" "}
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">cocinas de toda la ciudad</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                La calidad y atención que distingue a Q'Menu — esa misma frescura, profesionalismo y cuidado por el producto — ahora con presencia digital constante.
                Iniciamos con <strong className="text-foreground">100 restaurantes durante el Mundial</strong> y proyectamos cerrar 2026 con <strong className="text-foreground">1,200 restaurantes inscritos</strong> en la app.
              </p>

              <div className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Inversión inicial propuesta</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-black text-foreground">$50M</span>
                      <span className="text-muted-foreground text-sm">COP · pago único</span>
                    </div>
                    <p className="text-foreground text-sm font-semibold mb-1">Plan Oro · Presencia durante TODO el año 2026</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Q'Menu estará presente en la app desde la firma del contrato hasta el <strong className="text-foreground">31 de diciembre de 2026</strong>, abarcando los meses previos, el desarrollo completo del Mundial FIFA 2026 y el cierre de año.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === PLANES === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Planes de Patrocinio</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Elige el nivel de{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">exposición</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Tres planes diseñados para distintos objetivos. <strong className="text-foreground">Vigencia desde la contratación hasta el 31 de diciembre de 2026</strong> — un solo pago por presencia durante todo el año.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sponsorPlans.map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative rounded-3xl border bg-card p-8 transition-all hover:shadow-2xl ${
                  plan.highlight
                    ? "border-yellow-500/50 shadow-xl shadow-yellow-500/10 md:scale-105"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold shadow-lg">
                    ⭐ MÁS VALOR
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">COP · pago único</span>
                  <p className="text-xs text-muted-foreground mt-1">Vigencia hasta el 31 de diciembre 2026</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/573146269531?text=Hola%2C%20soy%20de%20Q%27Menu%20y%20me%20interesa%20el%20${encodeURIComponent(plan.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center w-full px-5 py-3 rounded-xl font-bold transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:brightness-110 shadow-lg"
                      : "bg-foreground text-background hover:brightness-110"
                  }`}
                >
                  Solicitar este plan
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === PUSH NOTIFICATIONS === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-background to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-5">
              <Bell className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-semibold text-sm">Notificaciones Push</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Directo al{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">bolsillo</span>
              {" "}de 50K+ usuarios
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Envía mensajes a miles de personas justo cuando van a salir a comer.
              Tasa de apertura del <strong className="text-foreground">90%</strong> vs. email (20%) o redes (5%).
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: Bell, color: "from-red-600 to-orange-500", iconColor: "text-white", title: "Q'Menu 🥩", msg: "¡Hoy juega Colombia! Reserva tu mesa en los restaurantes con la mejor parrilla Q'Menu de Cali 🇨🇴⚽", time: "Ahora" },
              { icon: Gift, color: "from-orange-500 to-amber-500", iconColor: "text-white", title: "Promo Q'Menu", msg: "20% off en cortes premium este fin de semana en 30 restaurantes del Mundial del Sabor 🔥", time: "Hace 2h" },
              { icon: Megaphone, color: "from-yellow-500 to-amber-500", iconColor: "text-black", title: "¡Gol de Colombia!", msg: "Celebra con una parrillada Q'Menu 🥩 Muestra esta notificación y recibe entrada gratis", time: "Hace 5min" },
            ].map((notif, i) => (
              <motion.div
                key={notif.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-red-500/30 hover:shadow-xl transition-all"
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
              { value: "45", label: "Push/mes (Oro)" },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-muted-foreground text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === DATA INTELLIGENCE === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-sm">Data de Restaurantes</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
                Optimiza tu{" "}
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">distribución</span>
                {" "}con datos reales
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                Accede a datos de comportamiento gastronómico: qué restaurantes consumen más carne, qué cortes son los más pedidos,
                en qué barrios hay mayor rotación y cómo se mueve la demanda durante cada partido del Mundial.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: MapPin, label: "Ubicación y barrios", value: "GPS tracking" },
                  { icon: Truck, label: "Rotación logística", value: "Demanda diaria" },
                  { icon: Store, label: "Restaurantes top", value: "Ranking" },
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
                  <strong>💡 Valor para Q'Menu:</strong> Con esta data puedes optimizar la distribución de cortes,
                  identificar los restaurantes con mayor rotación, planificar campañas hiper-segmentadas y
                  medir el impacto real de cada acción comercial durante el Mundial.
                </p>
              </div>
            </motion.div>

            {/* Dashboard mockup */}
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
                  <span className="text-muted-foreground text-xs ml-2">Dashboard — Q'Menu Analytics</span>
                </div>

                <div className="mb-6">
                  <div className="text-muted-foreground text-xs mb-3 uppercase tracking-wider">Consumo de carnes por categoría</div>
                  <div className="space-y-3">
                    {[
                      { label: "Parrilla & Asados", pct: 92, color: "from-red-600 to-orange-500" },
                      { label: "Carnes a la Brasa", pct: 78, color: "from-orange-500 to-amber-500" },
                      { label: "Hamburguesas Gourmet", pct: 71, color: "from-yellow-500 to-orange-500" },
                      { label: "Restaurantes Casual", pct: 60, color: "from-amber-500 to-yellow-500" },
                      { label: "Comida Rápida", pct: 48, color: "from-orange-400 to-red-400" },
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

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Escaneos QR", value: "12,847", trend: "+34%" },
                    { label: "Kg estimados/sem", value: "8,540", trend: "+28%" },
                    { label: "Restaurantes", value: "100 → 1,200", trend: "Meta 2026" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-muted/50 text-center">
                      <div className="text-foreground font-bold text-base">{stat.value}</div>
                      <div className="text-muted-foreground text-[10px]">{stat.label}</div>
                      <div className="text-green-500 text-xs font-semibold mt-1">{stat.trend}</div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-5 right-8 bg-gradient-to-r from-red-600 to-orange-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2"
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full" />

            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-accent font-semibold text-sm tracking-widest uppercase">Alcance Garantizado</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Datos que respaldan la inversión</h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  Con El Mundial del Sabor, Q'Menu accede a una base activa de consumidores gastronómicos en Cali,
                  con datos precisos de comportamiento, preferencias y ubicación.
                </p>
                <ul className="space-y-3">
                  {[
                    "Inicio con 100 restaurantes durante el Mundial",
                    "Proyección de 1,200 restaurantes al cierre de 2026",
                    "Visitas estimadas de 50,000+ usuarios",
                    "KPIs de colocación de carne en tiempo real",
                    "Métricas de engagement y escaneos QR",
                    "Segmentación por barrio, categoría y hábitos",
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
                  { number: "100→1,200", label: "Restaurantes (proyección 2026)", emoji: "🍽️" },
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

      {/* === DISTRIBUTION IMAGE === */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={qmenuDistribution} alt="Distribución Q'Menu" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <motion.div {...fadeUp} className="container mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              De la planta a 100 restaurantes — y creciendo a 1,200
            </h3>
            <p className="text-white/70 text-lg max-w-xl">
              Arrancamos cubriendo 100 puntos durante el Mundial y escalamos a 1,200 restaurantes inscritos al cierre de 2026, con tracking digital y datos de rotación en cada punto.
            </p>
          </motion.div>
        </div>
      </section>

      {/* === PRODUCCIÓN === */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-accent font-semibold text-sm tracking-widest uppercase">Producción de Contenido</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
              Contenido exclusivo para{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Q'Menu</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Camera, number: "20", title: "Videos UGC", description: "Videos publicitarios de contenido generado por usuarios reales disfrutando cortes Q'Menu en restaurantes.", gradient: "from-pink-500 to-rose-600" },
              { icon: Sparkles, number: "30", title: "Videos con IA", description: "Videos publicitarios generados con Inteligencia Artificial para campañas digitales innovadoras de Q'Menu.", gradient: "from-purple-500 to-indigo-600" },
              { icon: Tv, number: "100+", title: "Videos en Restaurantes", description: "Publicidad de Q'Menu en TVs de los restaurantes participantes. Inicio con 100 puntos, escalando a 1,200 al cierre 2026.", gradient: "from-red-500 to-orange-600" },
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
          <img src={qmenuGrill} alt="" className="w-full h-full object-cover opacity-25" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2e0a0a]/90 via-[#1a0808]/95 to-[#0a0a0a]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeUp}>
            <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight" style={{ letterSpacing: '-0.04em' }}>Q'menu</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">¿Listo para ser el patrocinador oficial?</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              Hablemos sobre cómo Q'Menu puede ser la carne oficial de El Mundial del Sabor 2026 en Cali.
            </p>
            <a
              href="https://wa.me/573146269531?text=Hola%2C%20soy%20de%20Q%27Menu%20y%20me%20interesa%20la%20propuesta%20de%20patrocinio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg hover:brightness-110 transition-all shadow-2xl shadow-red-500/30"
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
            El Mundial del Sabor 2026 · Propuesta confidencial para Q'Menu · Cali, Colombia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QmenuProposal;
