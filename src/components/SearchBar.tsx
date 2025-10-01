import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar lugares, categorías..."
        className="pl-10 bg-muted/50"
      />
    </div>
  );
};

export default SearchBar;
