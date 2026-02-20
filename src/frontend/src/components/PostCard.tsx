import { Post, UserProfile } from '../backend';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import LikeButton from './LikeButton';
import InvestmentRating from './InvestmentRating';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { Category } from '../backend';

interface PostCardProps {
  post: Post;
}

const categoryLabels: Record<Category, string> = {
  [Category.environmental]: 'Environmental',
  [Category.disasterRelated]: 'Disaster Relief',
  [Category.sustainableInfrastructure]: 'Sustainable Infrastructure',
};

const categoryColors: Record<Category, string> = {
  [Category.environmental]: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  [Category.disasterRelated]: 'bg-neon-pink/20 text-neon-pink border-neon-pink/50',
  [Category.sustainableInfrastructure]: 'bg-neon-blue/20 text-neon-blue border-neon-blue/50',
};

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { data: authorProfile } = useGetUserProfile(post.author);

  const handleCardClick = () => {
    navigate({ to: '/post/$postId', params: { postId: post.id.toString() } });
  };

  const authorName = authorProfile?.name || 'Anonymous';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formattedDate = new Date(Number(post.timestamp) / 1000000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group hover:shadow-xl hover:shadow-neon-green/10 transition-all duration-300 cursor-pointer border-border/50 hover:border-neon-green/50 overflow-hidden">
      <div onClick={handleCardClick}>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-neon-green/50">
                <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-background font-bold">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{authorName}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formattedDate}
                </div>
              </div>
            </div>
            <Badge className={`${categoryColors[post.category]} border`}>
              {categoryLabels[post.category]}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-foreground group-hover:text-neon-green transition-colors line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground line-clamp-3">{post.description}</p>

          {post.virtualPrototype && post.virtualPrototype.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-border/50">
              <img
                src={post.virtualPrototype.imageUrl}
                alt="Virtual prototype"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-border/50">
        <InvestmentRating post={post} />
        
        <div className="flex items-center justify-between w-full">
          <LikeButton postId={post.id} likeCount={Number(post.likeCount)} />
          
          <button
            onClick={handleCardClick}
            className="flex items-center space-x-2 text-muted-foreground hover:text-neon-blue transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Comments</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
