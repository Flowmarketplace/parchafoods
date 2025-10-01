import { useState } from 'react';
import { Heart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const Favorites = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Mis Favoritos</h1>
              <p className="text-muted-foreground">
                Tus lugares guardados
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-muted rounded-full p-6 mb-4">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No tienes favoritos aún</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Empieza a explorar lugares y guarda tus favoritos para acceder rápidamente a ellos
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Favorites;
