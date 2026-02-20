import { Post, InvestmentRating as InvestmentRatingEnum } from '../backend';
import { useAddInvestmentRating } from '../hooks/useAddInvestmentRating';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface InvestmentRatingProps {
  post: Post;
}

const ratings = [
  {
    type: InvestmentRatingEnum.diamond,
    icon: '/assets/generated/diamond-icon.dim_64x64.png',
    label: 'Diamond',
    range: '$100-300',
    color: 'hover:shadow-white/50',
  },
  {
    type: InvestmentRatingEnum.blueSapphire,
    icon: '/assets/generated/blue-sapphire-icon.dim_64x64.png',
    label: 'Blue Sapphire',
    range: '$300-500',
    color: 'hover:shadow-neon-blue/50',
  },
  {
    type: InvestmentRatingEnum.redRuby,
    icon: '/assets/generated/red-ruby-icon.dim_64x64.png',
    label: 'Red Ruby',
    range: '$500-700',
    color: 'hover:shadow-neon-pink/50',
  },
];

export default function InvestmentRating({ post }: InvestmentRatingProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const addRating = useAddInvestmentRating();

  const handleRating = async (rating: InvestmentRatingEnum, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to rate posts');
      return;
    }

    try {
      await addRating.mutateAsync({ postId: post.id, rating });
      toast.success('Investment interest recorded!');
    } catch (error) {
      console.error('Error adding rating:', error);
      toast.error('Failed to record rating');
    }
  };

  const getCounts = () => ({
    [InvestmentRatingEnum.diamond]: Number(post.diamondCount),
    [InvestmentRatingEnum.blueSapphire]: Number(post.blueSapphireCount),
    [InvestmentRatingEnum.redRuby]: Number(post.redRubyCount),
  });

  const counts = getCounts();

  return (
    <div className="flex items-center justify-around w-full gap-2">
      {ratings.map((rating) => (
        <button
          key={rating.type}
          onClick={(e) => handleRating(rating.type, e)}
          disabled={addRating.isPending}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg ${rating.color} group`}
          title={`${rating.label}: ${rating.range}`}
        >
          <img
            src={rating.icon}
            alt={rating.label}
            className="h-8 w-8 object-contain group-hover:scale-110 transition-transform"
          />
          <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">
            {counts[rating.type]}
          </span>
        </button>
      ))}
    </div>
  );
}
