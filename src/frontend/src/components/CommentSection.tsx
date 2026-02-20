import { useState } from 'react';
import { Comment } from '../backend';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetComments } from '../hooks/useGetComments';
import { useAddComment } from '../hooks/useAddComment';
import { useGetUserProfile } from '../hooks/useGetUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface CommentSectionProps {
  postId: bigint;
}

function CommentItem({ comment }: { comment: Comment }) {
  const { data: authorProfile } = useGetUserProfile(comment.author);
  const authorName = authorProfile?.name || 'Anonymous';
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formattedDate = new Date(Number(comment.timestamp) / 1000000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex space-x-3 py-3">
      <Avatar className="h-8 w-8 border border-neon-green/50">
        <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-background text-xs font-bold">
          {authorInitials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{authorName}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="text-sm text-foreground">{comment.text}</p>
      </div>
    </div>
  );
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: comments = [], isLoading } = useGetComments(postId);
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await addComment.mutateAsync({ postId, text: commentText.trim() });
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Comments ({comments.length})</h3>
      <Separator />

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[80px] resize-none"
          />
          <Button
            type="submit"
            disabled={addComment.isPending || !commentText.trim()}
            className="bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-lg hover:shadow-neon-green/50"
          >
            <Send className="h-4 w-4 mr-2" />
            {addComment.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Please login to leave a comment
        </p>
      )}

      <Separator />

      {isLoading ? (
        <p className="text-center text-muted-foreground py-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {comments.map((comment, index) => (
              <CommentItem key={index} comment={comment} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
