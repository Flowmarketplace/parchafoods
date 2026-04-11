import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/portada_mundial_del_sabor_2026.jpg";

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/landing" className="flex items-center gap-2.5">
          <img src="/mundial-sabor-icon.png" alt="El Mundial del Sabor" className="h-10 w-10 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm leading-tight text-foreground">El Mundial</span>
            <span className="font-extrabold text-sm leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">del Sabor 2026</span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#que-es" className="text-muted-foreground hover:text-foreground transition-colors text-sm">¿Qué es?</a>
          <a href="#funciones" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Funciones</a>
          <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Cómo Funciona</a>
          <a href="#negocios" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Para Negocios</a>
          <a
            href="/app"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shadow-md"
          >
            Entrar a la App
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden backdrop-blur-xl bg-background/95 border-t border-border/50"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <a href="#que-es" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">¿Qué es?</a>
            <a href="#funciones" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">Funciones</a>
            <a href="#como-funciona" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">Cómo Funciona</a>
            <a href="#negocios" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">Para Negocios</a>
            <a
              href="/app"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm text-center"
            >
              Entrar a la App
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default LandingNavbar;
