import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category } from '../backend';

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      category: Category;
      virtualPrototype: { imageUrl: string; description: string } | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(
        params.title,
        params.description,
        params.category,
        params.virtualPrototype
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
