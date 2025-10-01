import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">Guía Cali</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Navegación</h2>
          <div className="grid gap-2">
            <button 
              onClick={() => navigate('/listings')}
              className="p-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Ver Lugares
            </button>
            <button 
              onClick={() => navigate('/events-all')}
              className="p-4 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
            >
              Ver Eventos
            </button>
            <button 
              onClick={() => navigate('/favorites')}
              className="p-4 bg-accent text-accent-foreground rounded-lg hover:opacity-90"
            >
              Favoritos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
