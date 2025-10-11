import { WeeklyRecommendations } from '@/components/WeeklyRecommendations';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-20 md:pb-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>

            {/* Weekly Recommendations Component */}
            <WeeklyRecommendations />
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Recommendations;
