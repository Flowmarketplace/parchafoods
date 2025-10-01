import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full">
            <MapPin className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <Button onClick={() => navigate('/')} size="lg">
          <Home className="mr-2 h-5 w-5" />
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
