import { useState } from 'react';
import { Category } from '../backend';
import CategoryFilter from '../components/CategoryFilter';
import PostCard from '../components/PostCard';
import { useGetAllPosts } from '../hooks/useGetAllPosts';
import { useGetPostsByCategory } from '../hooks/useGetPostsByCategory';
import { Loader2 } from 'lucide-react';

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  
  const { data: allPosts = [], isLoading: loadingAll } = useGetAllPosts();
  const { data: filteredPosts = [], isLoading: loadingFiltered } = useGetPostsByCategory(
    activeCategory !== 'all' ? activeCategory : Category.environmental
  );

  const posts = activeCategory === 'all' ? allPosts : filteredPosts;
  const isLoading = activeCategory === 'all' ? loadingAll : loadingFiltered;

  return (
    <div className="space-y-8">
      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-2xl">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Neon Genesis Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end justify-center pb-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink bg-clip-text text-transparent">
              Innovate for a Sustainable Future
            </h1>
            <p className="text-lg text-muted-foreground">
              Share ideas, inspire change, build tomorrow
            </p>
          </div>
        </div>
      </div>

      <CategoryFilter activeCategory={activeCategory} onFilterChange={setActiveCategory} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No posts yet. Be the first to share an idea!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
