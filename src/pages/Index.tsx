import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-7rem)]">
            <MapComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
