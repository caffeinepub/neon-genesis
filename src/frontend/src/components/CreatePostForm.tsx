import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '../backend';
import { useCreatePost } from '../hooks/useCreatePost';
import { Upload, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const categoryOptions = [
  { value: Category.environmental, label: 'Environmental' },
  { value: Category.disasterRelated, label: 'Disaster Relief' },
  { value: Category.sustainableInfrastructure, label: 'Sustainable Infrastructure' },
];

export default function CreatePostForm() {
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [prototypeDescription, setPrototypeDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let virtualPrototype: { imageUrl: string; description: string } | null = null;

      if (imageUrl.trim() || prototypeDescription.trim()) {
        virtualPrototype = {
          imageUrl: imageUrl.trim(),
          description: prototypeDescription.trim(),
        };
      }

      await createPost.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        virtualPrototype,
      });

      toast.success('Post created successfully!');
      navigate({ to: '/' });
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink bg-clip-text text-transparent flex items-center">
          <Sparkles className="h-8 w-8 mr-2 text-neon-green" />
          Share Your Sustainable Idea
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your idea a compelling title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your sustainable solution in detail..."
              className="min-h-[150px] resize-none"
              required
            />
          </div>

          <div className="space-y-4 p-4 border border-border/50 rounded-lg bg-card/50">
            <h3 className="font-semibold text-lg">Virtual Prototype (Optional)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="prototypeDescription">Prototype Description</Label>
              <Textarea
                id="prototypeDescription"
                value={prototypeDescription}
                onChange={(e) => setPrototypeDescription(e.target.value)}
                placeholder="Describe your prototype or concept..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Prototype Image URL</Label>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a URL to an image hosted online (e.g., Imgur, Google Drive, etc.)
              </p>
              {imagePreview && (
                <div className="mt-4 rounded-lg overflow-hidden border border-border">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                    onError={() => {
                      setImagePreview(null);
                      toast.error('Failed to load image from URL');
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPost.isPending}
              className="flex-1 bg-gradient-to-r from-neon-green to-neon-blue hover:shadow-lg hover:shadow-neon-green/50"
            >
              {createPost.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
