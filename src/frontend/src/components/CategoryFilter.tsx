import { Badge } from '@/components/ui/badge';
import { Category } from '../backend';

interface CategoryFilterProps {
  activeCategory: Category | 'all';
  onFilterChange: (category: Category | 'all') => void;
}

const categories = [
  { value: 'all' as const, label: 'All Ideas', color: 'default' },
  { value: Category.environmental, label: 'Environmental', color: 'neon-green' },
  { value: Category.disasterRelated, label: 'Disaster Relief', color: 'neon-pink' },
  { value: Category.sustainableInfrastructure, label: 'Sustainable Infrastructure', color: 'neon-blue' },
];

export default function CategoryFilter({ activeCategory, onFilterChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onFilterChange(cat.value)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            activeCategory === cat.value
              ? 'bg-gradient-to-r from-neon-green to-neon-blue text-background shadow-lg shadow-neon-green/50 scale-105'
              : 'bg-card hover:bg-accent text-foreground border border-border'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
