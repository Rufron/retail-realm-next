
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Props expected by the SearchBar component
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

// Functional component that renders a styled input with a search icon
export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-11 text-base"
      />
    </div>
  );
};
