import { Heart } from 'lucide-react';
import { useLikePost } from '../hooks/useLikePost';
import { useUnlikePost } from '../hooks/useUnlikePost';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import { toast } from 'sonner';

interface LikeButtonProps {
  postId: bigint;
  likeCount: number;
}

export default function LikeButton({ postId, likeCount }: LikeButtonProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      if (isLiked) {
        await unlikePost.mutateAsync(postId);
        setIsLiked(false);
      } else {
        await likePost.mutateAsync(postId);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={likePost.isPending || unlikePost.isPending}
      className="flex items-center space-x-2 group"
    >
      <Heart
        className={`h-5 w-5 transition-all duration-300 ${
          isLiked
            ? 'fill-neon-pink text-neon-pink scale-110'
            : 'text-muted-foreground group-hover:text-neon-pink group-hover:scale-110'
        }`}
      />
      <span className={`text-sm font-medium ${isLiked ? 'text-neon-pink' : 'text-muted-foreground'}`}>
        {likeCount}
      </span>
    </button>
  );
}
