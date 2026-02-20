import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Post, Category } from '../backend';

export function useGetPostsByCategory(category: Category) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPostsByCategory(category);
    },
    enabled: !!actor && !actorFetching,
  });
}
