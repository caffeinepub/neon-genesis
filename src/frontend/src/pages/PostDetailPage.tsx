import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useGetPost } from '../hooks/useGetPost';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import LikeButton from '../components/LikeButton';
import InvestmentRating from '../components/InvestmentRating';
import CommentSection from '../components/CommentSection';
import { Category } from '../backend';

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

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { data: post, isLoading } = useGetPost(BigInt(postId));
  const { data: authorProfile } = useGetUserProfile(post?.author);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">Post not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          Back to Feed
        </Button>
      </div>
    );
  }

  const authorName = authorProfile?.name || 'Anonymous';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formattedDate = new Date(Number(post.timestamp) / 1000000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Feed
      </Button>

      <Card className="border-border/50 shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-neon-green/50">
                <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-background font-bold">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{authorName}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formattedDate}
                </div>
              </div>
            </div>
            <Badge className={`${categoryColors[post.category]} border`}>
              {categoryLabels[post.category]}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
            {post.title}
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>

          {post.virtualPrototype && (
            <div className="space-y-4 p-6 border border-border/50 rounded-lg bg-card/50">
              <h3 className="text-xl font-bold text-neon-green">Virtual Prototype</h3>
              
              {post.virtualPrototype.description && (
                <p className="text-foreground">{post.virtualPrototype.description}</p>
              )}
              
              {post.virtualPrototype.imageUrl && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={post.virtualPrototype.imageUrl}
                    alt="Virtual prototype"
                    className="w-full max-h-[500px] object-contain bg-black/5"
                  />
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Investment Interest</h3>
            <InvestmentRating post={post} />
          </div>

          <Separator />

          <div className="flex items-center justify-center">
            <LikeButton postId={post.id} likeCount={Number(post.likeCount)} />
          </div>

          <Separator />

          <CommentSection postId={post.id} />
        </CardContent>
      </Card>
    </div>
  );
}
