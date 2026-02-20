import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { InvestmentRating } from '../backend';

export function useAddInvestmentRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { postId: bigint; rating: InvestmentRating }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addInvestmentRating(params.postId, params.rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
}
