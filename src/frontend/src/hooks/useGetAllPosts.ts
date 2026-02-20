import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Post } from '../backend';

export function useGetAllPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}
