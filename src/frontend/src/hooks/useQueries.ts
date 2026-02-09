import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Protagonist, PersistentGameState, QuestJournalEntry, Appearance, PersonalityTraits, Quest } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetProtagonist() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Protagonist | null>({
    queryKey: ['protagonist'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProtagonist();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateProtagonist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appearance, traits, background }: { appearance: Appearance; traits: PersonalityTraits; background: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProtagonist(appearance, traits, background);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protagonist'] });
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useGetPersistentGameState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PersistentGameState | null>({
    queryKey: ['gameState'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPersistentGameState();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetActiveQuests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<QuestJournalEntry[]>({
    queryKey: ['activeQuests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveQuests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateQuestProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questId, objectiveIndex, completed }: { questId: string; objectiveIndex: bigint; completed: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateQuestProgress(questId, objectiveIndex, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeQuests'] });
    },
  });
}

export function useCompleteQuest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeQuest(questId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeQuests'] });
    },
  });
}

export function useAddQuestToPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addQuestToPlayer(questId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeQuests'] });
    },
  });
}

export function useAdvanceDialogue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentNodeId, choiceIndex }: { currentNodeId: string; choiceIndex: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.advanceDialogue(currentNodeId, choiceIndex);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}
