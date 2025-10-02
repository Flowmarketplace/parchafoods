import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import CategoryBar from '@/components/CategoryBar';
import ShortsCarousel from '@/components/ShortsCarousel';
import { mockShorts } from '@/data/shorts';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Shorts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const navigate = useNavigate();

  // Get unique categories from shorts
  const categories = useMemo(() => {
    const uniqueCategories = new Set(mockShorts.map(short => short.category));
    return Array.from(uniqueCategories).sort();
  }, []);

  // Group shorts by category
  const shortsByCategory = useMemo(() => {
    const grouped: { [key: string]: typeof mockShorts } = {};
    
    if (selectedCategory !== 'Todos') {
      grouped[selectedCategory] = mockShorts.filter(short => short.category === selectedCategory);
    } else {
      categories.forEach(category => {
        grouped[category] = mockShorts.filter(short => short.category === category);
      });
    }
    
    return grouped;
  }, [selectedCategory, categories]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedNeighborhood={selectedNeighborhood}
        onNeighborhoodChange={setSelectedNeighborhood}
      />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-primary/10 border-b border-border">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mb-4 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Todos los Reels
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Descubre contenido de creadores locales
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryBar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Shorts by Category */}
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 pb-20 md:pb-8">
            {Object.entries(shortsByCategory).map(([category, shorts]) => (
              shorts.length > 0 && (
                <section key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-1 rounded-full bg-purple-500" />
                    <h2 className="text-xl sm:text-2xl font-bold">{category}</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground">
                      {shorts.length} {shorts.length === 1 ? 'video' : 'videos'}
                    </span>
                  </div>
                  <ShortsCarousel shorts={shorts} />
                </section>
              )
            ))}
            
            {Object.values(shortsByCategory).every(shorts => shorts.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay videos disponibles para esta categoría
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Shorts;
