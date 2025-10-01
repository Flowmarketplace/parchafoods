import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import CategoryBar from '@/components/CategoryBar';
import FilterBar from '@/components/FilterBar';
import PlacesList from '@/components/PlacesList';
import { mockPlaces } from '@/data/places';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');

  // Filter places based on all criteria
  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
      const neighborhoodMatch = selectedNeighborhood === 'Todos' || place.neighborhood === selectedNeighborhood;
      const searchMatch = searchQuery === '' || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && neighborhoodMatch && searchMatch;
    });
  }, [selectedCategory, selectedNeighborhood, searchQuery]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-16 md:pt-28">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          {/* Map Section */}
          <div className="h-[50vh] md:h-[60vh]">
            <MapComponent 
              selectedNeighborhood={selectedNeighborhood}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Category Bar */}
          <CategoryBar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodChange={setSelectedNeighborhood}
          />

          {/* Places List */}
          <PlacesList places={filteredPlaces} />
        </main>
      </div>
    </div>
  );
};

export default Index;
