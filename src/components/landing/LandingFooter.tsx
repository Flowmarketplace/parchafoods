const LandingFooter = () => {
  return (
    <footer className="border-t border-border py-12 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/mundial-sabor-icon.png" alt="Parchafoods" className="h-12 w-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Parchafoods</span>
              <span className="text-[10px] text-muted-foreground">Comer, saber y vivir ⚽</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a href="#que-es" className="text-muted-foreground hover:text-foreground transition-colors text-sm">¿Qué es?</a>
            <a href="#funciones" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Funciones</a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Proceso</a>
            <a href="#negocios" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Negocios</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <a href="https://wa.me/573146269531" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              📞 +57 314 626 9531
            </a>
            <p className="text-muted-foreground text-xs">
              © 2026 Parchafoods. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
