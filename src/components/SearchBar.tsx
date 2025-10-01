import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  return (
    <div className="relative">
      <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar lugares..."
        className="pl-8 sm:pl-10 bg-muted/50 h-9 sm:h-10 text-sm"
      />
    </div>
  );
};

export default SearchBar;
